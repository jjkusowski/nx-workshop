import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

interface Schema {
  name: string;
  directory: 'store' | 'api' | 'shared';
}
export default async function (tree: Tree, schema: Schema) {
  await libraryGenerator(tree, { name: `util-${schema.name}`, directory: schema.directory , tags: `type:util, scope:${schema.directory}`});
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
