const index = require("../src/index");

const { feel } = require('eval-feel')();

const rule1 = 'a + b - c';
const rule2 = "every x in d satisfies x.i = 10";
const rule3 = "some x in d satisfies x.i = 10";
const rule4 = 'for a in d return a.xyz="abc"';
const rule = 'every x in d[xyz!="spqr"].i satisfies x=10';
const context = {
  a: 10,
  b: 20,
  c: 5,
  d: [{ xyz: "abc", i: 10 }, { xyz: "pqr", i: 10 }],
  e: [1, 2, 3]
};

test('Test list expressions every', async () => {
  const rule = "every x in d satisfies x.i = 10";
  const parsedGrammar = feel.parse(rule);
  const context = {
    d: [{ xyz: "abc", i: 10 }, { xyz: "pqr", i: 10 }],
  };
  const result = await parsedGrammar.build(context);
  expect(result).toBe(true);
});

test('Test list expressions for', async () => {
  const rule = 'for a in d return a.xyz="abc"';
  const parsedGrammar = feel.parse(rule);
  const context = {
    d: [{ xyz: "abc", i: 10 }, { xyz: "pqr", i: 10 }],
  };
  const result = await parsedGrammar.build(context);
  expect(result).toStrictEqual([true, false]);
});

test('Test list expressions some', async () => {
  const rule = "some x in d satisfies x.i = 10";
  const parsedGrammar = feel.parse(rule);
  const context = {
    d: [{ xyz: "abc", i: 10 }, { xyz: "pqr", i: 10 }],
  };
  const result = await parsedGrammar.build(context);
  expect(result).toBe(true);
});

test('Test list expressions every and item filter', async () => {
  const rule = 'every x in d[xyz!="spqr"].i satisfies x=10';
  const parsedGrammar = feel.parse(rule);
  const context = {
    d: [{ xyz: "abc", i: 10 }, { xyz: "pqr", i: 10 }],
  };
  const result = await parsedGrammar.build(context);
  expect(result).toBe(true);
});

test('list filter', async () => {
  const rule = 'd[xyz!="spqr"]';
  const parsedGrammar = feel.parse(rule);
  const context = {
    d: [{ xyz: "abc", i: 10 }, { xyz: "pqr", i: 10 }],
  };
  const result = await parsedGrammar.build(context);
  expect(result).toStrictEqual([{ "i": 10, "xyz": "abc" }, { "i": 10, "xyz": "pqr" }]);
});

test('list filter with accessing the object', async () => {
  const rule = 'd[xyz!="spqr"].xyz';
  const parsedGrammar = feel.parse(rule);
  const context = {
    d: [{ xyz: "abc", i: 10 }, { xyz: "pqr", i: 10 }],
  };
  const result = await parsedGrammar.build(context);
  expect(result).toStrictEqual(["abc", "pqr"]);
});

test('list mean', async () => {
  const rule = 'mean([1,2,3,4,5])';
  const parsedGrammar = feel.parse(rule);
  const context = {
    d: [{ xyz: "abc", i: 10 }, { xyz: "pqr", i: 10 }],
  };
  const result = await parsedGrammar.build(context);
  expect(result).toStrictEqual(3);
});

test('list mean with accessing the object', async () => {
  const rule = 'mean(d.i)';
  const parsedGrammar = feel.parse(rule);
  const context = {
    d: [{ xyz: "abc", i: 1 }, { xyz: "pqr", i: 2 }, { xyz: "nme", i: 3 }],
  };
  const result = await parsedGrammar.build(context);
  expect(result).toStrictEqual(2);
});

test('period', async () => {
  const rule = 'dt in [referenceDate .. referenceDate1]';
  // const rule = 'now()';
  const parsedGrammar = feel.parse(rule);
  const context = {
    dt: 'date and time("2017-04-12T12:50:00Z")',
    referenceDate: 'date and time("2017-04-12T12:45:00Z")',
    referenceDate1: 'date and time("2017-04-12T12:55:00Z")',
  };
  const result = await parsedGrammar.build(context);
  expect(result).toStrictEqual(true);
});

test('period with js date', async () => {
  const rule = 'dt in [referenceDate .. referenceDate1]';
  // const rule = 'now()';
  const parsedGrammar = feel.parse(rule);
  const context = {
    dt: new Date("2017-04-12T12:50:00Z"),
    referenceDate: new Date("2017-04-12T12:45:00Z"),
    referenceDate1: new Date("2017-04-12T12:55:00Z"),
  };
  const result = await parsedGrammar.build(context);
  expect(result).toStrictEqual(true);
});

async function evaluateRule(context, rule) {
  const parsedGrammar = feel.parse(rule);
  const result = await parsedGrammar.build(context);
  return result;
}

test('date comparison', async () => {
  const context = {
    dt: new Date("2017-04-12T12:50:00Z"),
    referenceDate: new Date("2017-04-12T12:45:00Z"),
    referenceDate1: new Date("2017-04-12T12:55:00Z"),
  };

  const rule = 'dt > referenceDate';
  // const rule = 'now()';
  expect(await evaluateRule(context, 'now()')).toBe(false);
  expect(await evaluateRule(context, 'dt > referenceDate')).toBe(true);
  expect(await evaluateRule(context, 'dt >= referenceDate')).toBe(true);
  expect(await evaluateRule(context, 'dt = referenceDate')).toBe(false);
  expect(await evaluateRule(context, 'dt < referenceDate')).toBe(false);
  expect(await evaluateRule(context, 'dt <= referenceDate')).toBe(false);
  
});


test('date conversion', async () => {
  const rule = 'date and time("2017-04-12T12:50:00Z")';
  // const rule = 'now()';
  const parsedGrammar = feel.parse(rule);
  const context = {
    dt: 'date and time("2017-04-12T12:50:00Z")',
    referenceDate: 'date and time("2017-04-12T12:45:00Z")',
    referenceDate1: 'date and time("2017-04-12T12:55:00Z")',
  };
  const result = await parsedGrammar.build(context);
  expect(result).toStrictEqual(true);
});

test('Complex array search', async () => {
  const rule = 'count(formSubmissions[formCode="profile" and toolkitCode="ba"]) > 0';
  // const rule = 'now()';
  const parsedGrammar = feel.parse(rule);
  const context = {
    formSubmissions: [
      {
          "_id": "63201b056fbf9d719808906b",
          "submissionContext": "",
          "toolkitCode": "ba",
          "formCode": "profile",
          "lastmodifiedat": "2022-09-13T05:55:22.780Z",
          "lastmodifiedby": {
              "email": "arvindsagarwal@gmail.com",
              "name": "Arvind Agarwal",
              "userid": "arvindsagarwal@gmail.com"
          }
      },
      {
          "_id": "63201b485b871f27f62a9623",
          "submissionContext": "",
          "lastmodifiedby": {
              "name": "Arvind Agarwal",
              "userid": "arvindsagarwal@gmail.com",
              "email": "arvindsagarwal@gmail.com"
          },
          "formCode": "profile",
          "toolkitCode": "ba",
          "lastmodifiedat": "2022-09-13T05:55:20.348Z"
      },
      {
          "_id": "63201b7d5b871f27f62aa145",
          "lastmodifiedby": {
              "email": "arvindsagarwal@gmail.com",
              "name": "Arvind Agarwal",
              "userid": "arvindsagarwal@gmail.com"
          },
          "lastmodifiedat": "2022-09-13T05:56:13.489Z",
          "submissionContext": "",
          "toolkitCode": "ba",
          "formCode": "strategy"
      }
    ]
  };
  const result = await parsedGrammar.build(context);
  expect(result).toStrictEqual(true);
});

