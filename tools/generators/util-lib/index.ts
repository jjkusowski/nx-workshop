import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

export default async function (tree: Tree, schema: any) {
  await libraryGenerator(tree, { name: `util-${schema.name}`, directory: schema.directory , tags: `type:util, scope:${schema.directory}`});
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
