import { App } from 'vue';
import { Theme } from '@compass-aiden/utils';
import { COMMON_THEME, DARK_THEME, LIGHT_THEME } from '~/config';
import { ConfigProvider } from 'ant-design-vue';

export const THEME_PROVIDE_KEY = 'Theme';

export default function injectTheme(app: App) {
  const theme = new Theme({ selector: 'body', baseThemeVariables: COMMON_THEME })
    .registerTheme('light', LIGHT_THEME)
    .registerTheme('dark', DARK_THEME);

  theme.toggleTheme('light');

  app.provide(THEME_PROVIDE_KEY, theme);

  ConfigProvider.config({
    theme: {
      primaryColor: '#C30D23',
    },
  });
}
