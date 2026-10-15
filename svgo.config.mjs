// Safe SVGO config for the animated art: the CSS keyframes target classes, ids and
// element structure, so every plugin that renames, merges, hoists or prunes them is off.
export default {
  multipass: false,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
          collapseGroups: false,
          minifyStyles: false,
          removeUnknownsAndDefaults: false,
          removeUselessDefs: false,
          removeUselessStrokeAndFill: false,
          convertTransform: false,
          moveElemsAttrsToGroup: false,
          moveGroupAttrsToElems: false,
          mergePaths: false,
          removeEmptyContainers: false,
          removeHiddenElems: false,
          removeViewBox: false,
        },
      },
    },
  ],
};
