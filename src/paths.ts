import { ParamHelper, type ParamType } from 'src/utilities';

export function formatPath(
  path: string,
  data = {},
  params?: ParamType,
  options?,
) {
  const url = ((path as string) + '/')
    .replaceAll('//', '/')
    .split('/')
    .map((fragment) => {
      const match = fragment.match(/^:(\w+)\??$/);
      if (!match) {
        return fragment;
      }

      const key = match[1];
      if (!data[key]) {
        if (options?.ignoreMissing) {
          // preserve for activateMenu
          return fragment;
        }

        if (!fragment.endsWith('?')) {
          throw new Error(`missing url param ${key}`);
        }

        return '';
      }

      return encodeURIComponent(data[key]);
    })
    .join('/')
    .replaceAll('//', '/');

  return params ? `${url}?${ParamHelper.getQueryString(params)}` : url;
}

// handle long/short EE routes:
// (path, container: 'namespaced/name') -> (path, { namespace: 'namespaced', container: 'name' })
// (path, container: 'simple') -> (path, { container: 'simple' })
// see also containerName
export function formatEEPath(path, data, params?) {
  if (data.container?.includes('/')) {
    const [namespace, container] = data.container.split('/');
    return formatPath(path, { ...data, namespace, container }, params);
  }

  return formatPath(path, data, params);
}

export const Paths = {
  ansibleRemoteDetail: '/ansible/remotes/:name',
  ansibleRemoteEdit: '/ansible/remotes/:name/edit',
  ansibleRemotes: '/ansible/remotes',
  ansibleRepositories: '/ansible/repositories',
  ansibleRepositoryDetail: '/ansible/repositories/:name',
  ansibleRepositoryEdit: '/ansible/repositories/:name/edit',
  approvalDashboard: '/approval-dashboard',
  collectionByRepo: '/repo/:repo/:namespace/:collection',
  collectionContentDocsByRepo:
    '/repo/:repo/:namespace/:collection/content/:type/:name',
  collectionContentListByRepo: '/repo/:repo/:namespace/:collection/content',
  collectionDependenciesByRepo:
    '/repo/:repo/:namespace/:collection/dependencies',
  collectionDistributionsByRepo:
    '/repo/:repo/:namespace/:collection/distributions',
  collectionDocsIndexByRepo: '/repo/:repo/:namespace/:collection/docs',
  collectionDocsPageByRepo: '/repo/:repo/:namespace/:collection/docs/:page',
  collectionImportLogByRepo: '/repo/:repo/:namespace/:collection/import-log',
  collections: '/collections',
  createRole: '/roles/create',
  createUser: '/users/create',
  editNamespace: '/my-namespaces/edit/:namespace',
  editUser: '/users/:userID/edit',
  executionEnvironmentDetailAccess:
    '/containers/:namespace?/:container/_content/access',
  executionEnvironmentDetailActivities:
    '/containers/:namespace?/:container/_content/activity',
  executionEnvironmentDetailImages:
    '/containers/:namespace?/:container/_content/images',
  executionEnvironmentDetail: '/containers/:namespace?/:container',
  executionEnvironmentManifest:
    '/containers/:namespace?/:container/_content/images/:digest',
  executionEnvironments: '/containers',
  executionEnvironmentsRegistries: '/registries',
  groupDetail: '/group/:group',
  groupList: '/group-list',
  login: '/login',
  myImports: '/my-imports',
  myNamespaces: '/my-namespaces',
  namespaceDetail: '/namespaces/:namespace',
  namespaces: '/namespaces',
  notFound: '/not-found', // FIXME don't redirect
  roleEdit: '/role/:role',
  roleList: '/roles',
  search: '/',
  signatureKeys: '/signature-keys',
  taskDetail: '/task/:task',
  taskList: '/tasks',
  token: '/token',
  userDetail: '/users/:userID',
  userList: '/users',
  userProfileSettings: '/settings/user-profile',
};
