// component

// ----------------------------------------------------------------------

import SvgColor from '../../../designComponents/svg-color';

const icon = (name) => (
  <SvgColor
    src={`${import.meta.env.VITE_APP_BASENAME}/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);
const navConfig = [

  {
    title: 'Articles',
    path: '/articles',
    icon: icon('ic_blog'),
  },
  {
    title: 'SITEMAP Check',
    path: '/articles?sitemapAdded=false&enabled=true',
    icon: icon('ic_blog'),
  },
  {
    title: 'Sitemap',
    path: '/sitemaps',
    icon: icon('ic_lock'),
  },
  {
    title: 'TYPES',
    path: '/types',
    icon: icon('ic_horse'),
  },
  {
    title: 'Utilisateur',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Connexion',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
