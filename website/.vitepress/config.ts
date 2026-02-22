// SPDX-License-Identifier: Apache-2.0

import { defineConfig, loadEnv } from 'vitepress'
import { attrs } from '@mdit/plugin-attrs';
import { figure } from '@mdit/plugin-figure';
import { imgLazyload } from '@mdit/plugin-img-lazyload';
import { imgMark } from '@mdit/plugin-img-mark';
import { imgSize } from '@mdit/plugin-img-size';
import { include } from '@mdit/plugin-include';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';
import shortcodePlugin from 'markdown-it-shortcode-tag';
import shortcodes from './config/shortcodes.ts';
import ElementPlus from 'unplugin-element-plus/vite';

import generateMeta from './config/hooks/generateMeta.ts';
import nav from './config/navigation/nav.ts';
import sidebar from './config/navigation/sidebar.ts';

const env = loadEnv('', process.cwd());
const hostname: string = env.VITE_HOSTNAME || 'http://localhost:4173';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "NovelSourcery",
  description: "An extension store for Tachiyomi and variants.",
  cleanUrls: true,
  transformHead: (context) => {
    context.head.push(['meta', { name: 'robots', content: 'noindex, nofollow' }]);
    context.head.push(...generateMeta(context, hostname));
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar,
    search: {
      provider: 'local'
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/novelsourcery/extensions',
        ariaLabel: 'Project GitHub',
      },
      {
        icon: 'discord',
        link: 'https://discord.gg/JG2K2jTjd6',
        ariaLabel: 'Discord server',
      },
    ],
    
    editLink: {
      pattern: 'https://github.com/novelsourcery/novelsourcery.github.io/edit/main/website/:path',
      text: 'Help us improve this page',
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        forceLocale: true,
        dateStyle: 'long',
        timeStyle: 'short',
      },
    },
  },
  markdown: {
    config: (md) => {
      md
        .use(attrs)
        .use(figure)
        .use(imgLazyload)
        .use(imgMark)
        .use(imgSize)
        .use(include, {
          currentPath: env => env.filePath,
        })
        .use(tabsMarkdownPlugin)
        .use(shortcodePlugin, shortcodes);
    }
  },
  vite: {
    plugins: [ElementPlus({})],
    ssr: {
      noExternal: ['element-plus'],
    }
  }
})
