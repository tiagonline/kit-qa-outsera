module.exports = {
  default: {
    paths: ["tests/e2e/features/**/*.feature"],
    requireModule: ["ts-node/register"],
    require: ["tests/e2e/steps/**/*.ts"],
    format: ["progress-bar", "html:cucumber-report.html"],
    publishQuiet: true,
  },
};
