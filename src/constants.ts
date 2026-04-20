import { NewsArticle, ViralNews } from './types';

export const BREAKING_NEWS: NewsArticle = {
  id: 'hero-1',
  title: 'Nowa era eksploracji kosmosu: Pierwsza stała baza na Księżycu staje się faktem.',
  description: 'Międzynarodowe konsorcjum ogłosiło zakończenie pierwszego etapu budowy habitatu, który pomieści dwunastu naukowców jeszcze w tym roku. To przełom, na który czekaliśmy dekady.',
  category: 'BREAKING NEWS',
  imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClkrAgvt4nI1XVue1xuvsMYcxMwwsjeJRgDm0BP64hPqWIIFBBGI9XPCMMUK8IBTRIcDEAtkLtuQV_Bn4h0LmxPBHUzAQG9KDnzhAKU-J_fSB1e770Vf8bz_jaQCx6LMOGO6QJCA1dwvzLWqlNRIhtjfIKZILFUNWIYwQJKOBURgshXTRUW6YdPh5oKTH_kpEKSR0FssbAhjj4Vr6Nb6xC3UV0NxQPYNxHNmAvyRKB9e78rJp9wykF5_Jtv9WpgZmf1BcVbs0YclvU',
  timestamp: '2024-04-15T10:00:00Z',
  readTime: '10 min',
  isBreaking: true,
};

export const ENTERTAINMENT_NEWS: NewsArticle[] = [
  {
    id: 'ent-1',
    title: 'Legendarny zespół ogłasza trasę po 20 latach przerwy.',
    description: 'Bilety wyprzedały się w 15 sekund, ustanawiając nowy rekord świata w szybkości sprzedaży na platformach streamingowych.',
    category: 'Muzyka',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBox6HFWEr6fKi7esmfnSzPY1ydj5KRLmsNMk4CZu86XAusOI78SvyL9uaSf8GUgRbn1CwWBTFMru9rzUxNYNjFXMmth97v3Quea25AwttedAC__LUVsW-WObZ5cmI3KkGxG74GqZBRLbxOeywUyKw4lts3RvnlDk7FHfQjK2krIteNChjIhMqHzXJZja0Fw6-aO275khkRuqoHBgygYGxNWd-vp4AjzyqYPTAwi7OG9gdH4qUZaznWvdTZm9jmGZHhCcLxvMrX23fW',
    timestamp: '2024-04-15T08:00:00Z',
    readTime: '4 min',
  },
  {
    id: 'ent-2',
    title: 'Oscary 2025: Niespodziewany faworyt z Europy Wschodniej.',
    description: 'Krytycy są zgodni – ten kameralny dramat zmieni sposób, w jaki myślimy o kinie niezależnym w nadchodzącej dekadzie.',
    category: 'Film',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH40-Bq5t5ILrpAZxZ71Pgx4KJaru-VXz4sFtvcsgO6v4igChhUJqyk5JSavwI1ZVXG4hMQHSvi1kZfDfKlEYwPejWywUH-bE2zRgxzDKCEd-uUiDt7kdViud5jepcffZQEJDRarckzdtelolfKhM3qSarT2gKscfNwf89XiXvSLKw1bAOi1sfvfwBJ08oTLVvURIEnbYtdS9hgko6s07oLlM169iZ8b9IB6UFP1vWf1zpQ1EnpY424HaqOHkw70pzVqPGhVofqL8y',
    timestamp: '2024-04-15T06:00:00Z',
    readTime: '6 min',
  },
];

export const TECH_NEWS: NewsArticle[] = [
  {
    id: 'tech-1',
    title: 'AI stworzyła procesor, którego nie rozumieją inżynierowie.',
    description: 'Jego wydajność przewyższa obecne jednostki o 400%, ale nikt nie potrafi wyjaśnić logicznego przepływu sygnałów w nowej architekturze.',
    category: 'Technologia',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4xxF_ctPs0xZLnAUp0fH-SQtYz9lUwRfaMN2oGCMge9FqVLHXQEeH4odR_wacPejjYd7DAGIbfKe7EaYqDED0Y8-z8sJDawFZDlNDKekoJMX7XjpSyxbG2kiD7g9McKE2VnsbNENgqhn4WHdNkOvwbjynRMrVIe1EBxoRJZrvHe3qeIGp0ipZUneZwf3cp0Kq7IbrP5V3Fyaq3q1pGEqeRsvHdweX4L5gmMvjuzNoQG13rPHBBfOnJkmbgOzzx0N71satRlkwpSGu',
    timestamp: '2024-04-15T09:00:00Z',
    readTime: '5 min',
  },
  {
    id: 'tech-2',
    title: "Koniec ery smartfonów? Wyciekły prototypy 'Neural Link Glasses'.",
    description: 'Nowe urządzenie ma całkowicie zastąpić ekrany dotykowe na rzecz interfejsu sterowanego myślami i gestami w przestrzeni 3D.',
    category: 'Technologia',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeNPzT3l3_QKah8TjPuJwM8p3YUNbQiupMExnj6DNMw-AeX7I831awDKNcRAoB--KeNWnRZAYAAH5fxb1R2jO41fZi-F-ye1c2K5gTZ9wPkBqgo2U-g_K3PtNu6Ehdgaz7JbxsxUCaBX6rENnAZ900hftKBmv7Bdzn3pKk4ingT-4a5Bx8WXOjAPptLN0R5ol6GMEywMdeV0EUVhYzOCrnUUoHCdSKLZLncT-x9HqiDS9ki2wiGjnWkoO9Ps8BWGaJwWSopn7cD8Mt',
    timestamp: '2024-04-15T05:00:00Z',
    readTime: '8 min',
  },
];

export const AMAZING_NEWS: NewsArticle[] = [
  {
    id: 'ama-1',
    title: 'W lasach Amazonii odkryto gatunek, który uznano za wymarły 200 lat temu.',
    description: '',
    category: 'Niesamowite',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCup0dXXDKWNhXOrkHbt53X97a-c_wbOXFqeTzKeJdC5CReMiWIzdg8oMkHzYUInkpfu5ZQzpvdiJlXcVrPwHea0XjdbOgo0x-2SGNP90ZxY9QlP1ZLYC5mJO2r06eoaRbJELYQwRMfzxJ2eeUMjUvsSysyKNkdhvf12Z7B2eEYWShwP-r1iacTaloaEURi-p2jMkZ3drm6oCRfziDoVvpx6RcKExDrd2QZ7zJCpPkYjvV7_KWVpTMTAu0cDzm9JRjPJ-F-fheiSpnG',
    timestamp: '2024-04-14T12:00:00Z',
    readTime: '3 min',
  },
  {
    id: 'ama-2',
    title: 'Dlaczego ocean świeci na niebiesko? Niezwykłe zjawisko u wybrzeży Australii.',
    description: '',
    category: 'Niesamowite',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkyq8C6XIOxKnm5bdSbLKxMSK5E7jBmsCBp5p2U1f_bqJXihxOaqgJr6U4jBcQeoP8sgUypD9sOKXR1269e8FDEMY-A1BHy8MW4cY8IFl9YVT9VWWReLpB6jA0HTw2-rIZKIgO_ECAt5NMWGjQ7GDsYNHwVe_JpmY-Fqgyfm8oTTmNZRFKyn_UenDa5n64lBNdVtJ1-gah8nQsFMJGHTpO9AeawuyoZQtiC3aINUuyCwIexEHv2e1TAKHcDsnW8JgzZiFbR7wMZJA1',
    timestamp: '2024-04-13T12:00:00Z',
    readTime: '4 min',
  },
  {
    id: 'ama-3',
    title: 'Wyspa, na której czas płynie wolniej. Naukowcy badają fenomen długowieczności.',
    description: '',
    category: 'Niesamowite',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF4TahDNMURTCZDu-9-lsNHvEn8AXCZHZRRO6DP-gr8b1fgEfOfR6zHGcHwpTdcF9jeU63EzSjfRfj_cA0cs5mJF9AI0SfL_g-eF3j6pDtvy4Ubb7g-REKGSjE6osSO6lLA5NHpLgeC3Y8_VvSo4512DzISsZ7CBcdoPDtBLqEFkXOps7nFb2PQB8bJZwN6tXw7KxDCU1xH3ClUgQo8_JgwsD3euY2DnrpT-KRiPJb2wnQyIKhhvhI3feubmmI_GncAL-eUIMwPA9p',
    timestamp: '2024-04-12T12:00:00Z',
    readTime: '5 min',
  },
];

export const VIRAL_NEWS: ViralNews[] = [
  {
    id: 'viral-1',
    rank: '01',
    title: 'Jak 19-latek zhakował systemy największego banku używając... tostera?',
    category: 'Technologia',
  },
  {
    id: 'viral-2',
    rank: '02',
    title: 'Ranking: 10 miejsc na świecie, które musisz odwiedzić przed końcem 2024.',
    category: 'Świat',
  },
  {
    id: 'viral-3',
    rank: '03',
    title: 'Nowy trend na TikToku zagraża zdrowiu? Lekarze biją na alarm.',
    category: 'Rozrywka',
  },
  {
    id: 'viral-4',
    rank: '04',
    title: 'Odkryto nieznane miasto pod piaskami Sahary dzięki zdjęciom satelitarnym.',
    category: 'Niesamowite',
  },
];
