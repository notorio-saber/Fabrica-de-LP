export interface LandingTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  buttonBackground: string;
  buttonText: string;
  border: string;
}

export const landingThemes: LandingTheme[] = [
  {
    id: 'rosa-original',
    name: 'Rosa Original',
    primary: '#5D1E69',
    secondary: '#FA66AF',
    accent: '#FA66AF',
    background: '#D8A7A0',
    surface: '#FCF1EA',
    text: '#444444',
    mutedText: '#666666',
    buttonBackground: '#5D1E69',
    buttonText: '#ffffff',
    border: '#FA66AF',
  },
  {
    id: 'nude-premium',
    name: 'Nude Premium',
    primary: '#8A5A44',
    secondary: '#D9A679',
    accent: '#D9A679',
    background: '#E4D2C3',
    surface: '#FBF6F0',
    text: '#4A3B33',
    mutedText: '#7A6A60',
    buttonBackground: '#8A5A44',
    buttonText: '#ffffff',
    border: '#D9A679',
  },
  {
    id: 'lilas-elegante',
    name: 'Lilás Elegante',
    primary: '#4B3A78',
    secondary: '#B79CED',
    accent: '#B79CED',
    background: '#CFC2E8',
    surface: '#F6F2FC',
    text: '#3D3452',
    mutedText: '#6E6480',
    buttonBackground: '#4B3A78',
    buttonText: '#ffffff',
    border: '#B79CED',
  },
  {
    id: 'preto-dourado',
    name: 'Preto e Dourado',
    primary: '#1A1A1A',
    secondary: '#C9A227',
    accent: '#C9A227',
    background: '#D9D2C2',
    surface: '#FAF7EF',
    text: '#1A1A1A',
    mutedText: '#5C5648',
    buttonBackground: '#1A1A1A',
    buttonText: '#ffffff',
    border: '#C9A227',
  },
];

export const defaultLandingTheme = landingThemes[0];
