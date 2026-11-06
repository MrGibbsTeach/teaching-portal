// Checks the Spec the Computer scenarios are still solvable.
// Run: node scripts/check-spec-computer.mjs
//
// It reads the part lists, scenarios and eight compatibility rules straight out of
// public/interactives/spec-computer.html, then brute-forces every build that:
//   1. fills the seven required slots,
//   2. stays inside the scenario budget,
//   3. passes every client need (including the 30% power headroom need), and
//   4. has no red compatibility rule.
// The page's own rulesFor() and needs functions are used, so this cannot drift
// from the interactive without failing.
import fs from "node:fs";
import vm from "node:vm";

const FILE = new URL("../public/interactives/spec-computer.html", import.meta.url);
const src = fs.readFileSync(FILE, "utf8");

function slice(startMarker, endMarker, from = 0) {
  const a = src.indexOf(startMarker, from);
  const b = src.indexOf(endMarker, a);
  if (a < 0 || b < 0) throw new Error(`Could not find ${startMarker} ... ${endMarker}`);
  return src.slice(a, b);
}

const dataBlock = slice("var CPU=[", "/* ---------- state ---------- */");
const rulesBlock = slice("function rulesFor(B){", "function fitHint(");

const ctx = vm.createContext({});
vm.runInContext(dataBlock, ctx);
vm.runInContext(rulesBlock, ctx);

ctx.fmt = (n) => "$" + Number(n).toLocaleString("en-AU");
ctx.gbTxt = (g) => (g >= 1000 ? g / 1000 + " TB" : g + " GB");
ctx.get = (k, B) => {
  const id = B[k];
  if (!id) return null;
  return ctx.LIST[k].find((x) => x.id === id) || null;
};
ctx.total = (B) =>
  Object.keys(ctx.LIST).reduce((sum, k) => {
    const x = ctx.get(k, B);
    return sum + (x ? x.p : 0);
  }, 0);

const { CPU, BOARD, RAM, GPU, STO, PSU, CASE, SC } = ctx;
const NONE = null;
const combos = {
  cpu: CPU,
  board: BOARD,
  ram: RAM,
  gpu: GPU,
  st1: STO,
  st2: [NONE, ...STO],
  psu: PSU,
  case: CASE,
};

const REQUIRED = ["cpu", "board", "ram", "gpu", "st1", "psu", "case"];

function nvmeCount(B) {
  return [B.st1, B.st2].filter((d) => d && d.type === "NVMe").length;
}
function sataCount(B) {
  return [B.st1, B.st2].filter((d) => d && d.type !== "NVMe").length;
}
function cheapChecks(B, s) {
  const cpu = ctx.get("cpu", B);
  const board = ctx.get("board", B);
  const ram = ctx.get("ram", B);
  const gpu = ctx.get("gpu", B);
  const cs = ctx.get("case", B);
  const psu = ctx.get("psu", B);
  if (!cpu || !board || !ram || !gpu || !cs || !psu) return false;
  if (ctx.total(B) > s.budget) return false;
  if (cpu.sock !== board.sock) return false;
  if (ram.type !== board.mem) return false;
  if (!cs.boards.includes(board.ff)) return false;
  if (gpu.id !== "none" && gpu.len > cs.gpuMax) return false;
  if (gpu.id === "none" && !cpu.igpu) return false;
  if (nvmeCount(B) > board.m2 || sataCount(B) > board.sata) return false;
  const draw = cpu.tdp + (gpu.id === "none" ? 0 : gpu.tdp) + 75;
  if (psu.w / draw < 1.3) return false; // the scenario power need asks for 30% spare
  return true;
}
function valid(B, s) {
  if (!cheapChecks(B, s)) return false;
  if (ctx.rulesFor(B).some((r) => r.state === "fail")) return false;
  return s.needs.every((n) => n.f(B)[0]);
}

const results = [];
for (const s of SC) {
  let count = 0;
  let cheapest = null;
  let checked = 0;
  for (const cpu of combos.cpu) {
    for (const board of combos.board) {
      if (cpu.sock !== board.sock) continue;
      for (const ram of combos.ram) {
        if (ram.type !== board.mem) continue;
        for (const gpu of combos.gpu) {
          if (gpu.id === "none" && !cpu.igpu) continue;
          for (const st1 of combos.st1) {
            for (const st2 of combos.st2) {
              const B = { cpu: cpu.id, board: board.id, ram: ram.id, gpu: gpu.id, st1: st1.id, st2: st2 ? st2.id : null, psu: null, case: null };
              if (ctx.total(B) > s.budget) continue;
              if (nvmeCount(B) > board.m2 || sataCount(B) > board.sata) continue;
              for (const psu of combos.psu) {
                for (const cs of combos.case) {
                  B.psu = psu.id;
                  B.case = cs.id;
                  checked++;
                  if (!valid(B, s)) continue;
                  count++;
                  const t = ctx.total(B);
                  if (!cheapest || t < cheapest.total) cheapest = { total: t, build: { ...B } };
                }
              }
            }
          }
        }
      }
    }
  }
  results.push({ scenario: s, count, checked, cheapest });
}

let problems = 0;
console.log("Spec the Computer: scenario feasibility\n");
for (const { scenario: s, count, checked, cheapest } of results) {
  const refTotal = ctx.total(s.ref);
  const refValid = valid(s.ref, s);
  const ok = count > 0 && refTotal <= s.budget && refValid;
  if (!ok) problems++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${s.name} (${s.id})  budget ${ctx.fmt(s.budget)}`);
  console.log(`      ${count.toLocaleString("en-AU")} working build(s) from ${checked.toLocaleString("en-AU")} combinations checked`);
  if (cheapest) {
    const names = ["cpu", "board", "ram", "gpu", "st1", "st2", "psu", "case"]
      .map((k) => {
        const x = ctx.get(k, cheapest.build);
        return x ? x.n : null;
      })
      .filter(Boolean);
    console.log(`      cheapest ${ctx.fmt(cheapest.total)}: ${names.join(" | ")}`);
  }
  console.log(`      reference ${ctx.fmt(refTotal)}: ${refValid ? "meets every need" : "DOES NOT meet every need"}`);
}

// Boundary checks for the rules that are easy to get wrong.
function build(overrides) {
  return { ...SC[0].ref, ...overrides };
}
const checks = [
  {
    name: "no dGPU + CPU without iGPU = display fail",
    pass: ctx.rulesFor(build({ cpu: "i512400f", gpu: "none" })).some((r) => r.id === "disp" && r.state === "fail"),
  },
  {
    name: "two NVMe drives on a 1 x M.2 board = connection fail",
    pass: ctx.rulesFor(build({ cpu: "r55600", board: "b550a", ram: "d416", gpu: "none", st1: "p310a", st2: "p310b" })).some((r) => r.id === "conn" && r.state === "fail"),
  },
  {
    name: "one NVMe + one SATA drive on the same board = pass",
    pass: ctx.rulesFor(build({ cpu: "r55600", board: "b550a", ram: "d416", gpu: "none", st1: "p310a", st2: "bc2" })).some((r) => r.id === "conn" && r.state === "pass"),
  },
  {
    name: "320 mm GPU in a 285 mm case = length fail",
    pass: ctx.rulesFor(build({ gpu: "rx9070xt", case: "sg13" })).some((r) => r.id === "len" && r.state === "fail"),
  },
  {
    name: "PSU at exactly 110% of estimated draw is a warning, not a pass",
    pass: ctx.rulesFor(build({ cpu: "u7265k", board: "b860m", ram: "d532", gpu: "rtx5070ti", psu: "cx550", case: "north" })).some((r) => r.id === "power" && r.state === "warn"),
  },
  {
    name: "PSU below 110% of estimated draw fails",
    pass: ctx.rulesFor(build({ cpu: "u7265k", board: "b860m", ram: "d532", gpu: "rx9070xt", psu: "cx550", case: "north" })).some((r) => r.id === "power" && r.state === "fail"),
  },
];
console.log("\nRule boundary checks\n");
for (const c of checks) {
  if (!c.pass) problems++;
  console.log(`${c.pass ? "PASS" : "FAIL"}  ${c.name}`);
}
console.log(`\n${problems ? problems + " problem(s) found" : "All checks passed"}`);
process.exitCode = problems ? 1 : 0;