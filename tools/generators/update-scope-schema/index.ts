import { Tree, formatFiles, readJson, updateJson } from '@nrwl/devkit';

function getScopes(nxJson: any) {
  const projects: any[] = Object.values(nxJson.projects);
  const allScopes: string[] = projects
    .map((project) =>
      project.tags
        // take only those that point to scope
        .filter((tag: string) => tag.startsWith('scope:'))
    )
    // flatten the array
    .reduce((acc, tags) => [...acc, ...tags], [])
    // remove prefix `scope:`
    .map((scope: string) => scope.slice(6));
  // remove duplicates
  return Array.from(new Set(allScopes));
}
function replaceScopes(content: string, scopes: string[]): string {
  const joinScopes = scopes.map((s) => `'${s}'`).join(' | ');
  const PATTERN = /interface Schema \{\n.*\n.*\n\}/gm;
  return content.replace(
    PATTERN,
    `interface Schema {
  name: string;
  directory: ${joinScopes};
}`
  );
}

export default async function (tree: Tree, schema: any) {
  // await updateJson(tree, 'workspace.json', (workspaceJson) => {
  //   workspaceJson.defaultProject = 'api';
  //   return workspaceJson;
  // });
  const nxJsonContents = readJson(tree, 'nx.json');
  const scopes = getScopes(nxJsonContents);
  updateJson(tree, 'tools/generators/util-lib/schema.json', (schemaJson) => {
    schemaJson.properties.directory['x-prompt'].items = scopes.map((scope) => ({
      value: scope,
      label: scope,
    }));
    return schemaJson;
  });
  const indexTs = tree.read('tools/generators/util-lib/index.ts', 'utf-8');
  const afterReplace = replaceScopes(indexTs, scopes);
  tree.write('tools/generators/util-lib/index.ts', afterReplace);
  await formatFiles(tree);
}
