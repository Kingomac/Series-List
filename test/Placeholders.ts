import { Category, Serie } from "../src/interfaces/Models";
import { FakeClient } from "./FakeClient";

type PlaceholderInfo = {
  name: string;
  image: string;
};

const SERIES: PlaceholderInfo[] = [
  {
    name: "Sonny Boy",
    image:
      "https://es.web.img2.acsta.net/c_310_420/pictures/21/06/17/12/59/4847468.jpg",
  },
  {
    name: "Non Non Biyori Nonstop",
    image:
      "https://ramenparados.com/wp-content/uploads/2020/05/Non-Non-Biyori-Nonstop-key.jpg",
  },
  {
    name: "Mushoku Tensei - Isekai Ittara Honki Dasu",
    image:
      "https://pics.filmaffinity.com/Mushoku_Tensei_Isekai_Ittara_Honki_Dasu_Serie_de_TV-104560602-large.jpg",
  },
  {
    name: "Kanojo mo Kanojo",
    image:
      "https://ramenparados.com/wp-content/uploads/2021/03/kanokano-anime-poster.jpg",
  },
  {
    name: "Fumetsu no Anata e",
    image:
      "https://www.animefagos.com/wp-content/uploads/2018/01/fumetsuanata01.jpg",
  },
  {
    name: "Sayonara Watashi no Cramer",
    image:
      "https://m.media-amazon.com/images/M/MV5BMDQ3NWNlOGUtNTMwMi00MWNjLWFjNWUtNDcxY2FkYTlkYTM0XkEyXkFqcGdeQXVyODMyNTM0MjM@._V1_.jpg",
  },
  {
    name: "Boku no Hero Academia 5",
    image:
      "https://i.pinimg.com/736x/c8/42/fc/c842fc99774afbeff6c07bb6c6a88536.jpg",
  },
  {
    name: "Tokyo Revengers",
    image: "https://images-na.ssl-images-amazon.com/images/I/810blpOrLhL.jpg",
  },
  {
    name: "Genjitsu Shugi Yuusha no Oukoku Saikenki",
    image:
      "https://somoskudasai.com/wp-content/uploads/2021/04/genjitsuyushakv.jpg",
  },
  {
    name: "Yakunara Mug Cup mo",
    image:
      "https://freakelitex.com/wp-content/uploads/2020/07/Yakunara-Mug-Cup-Mo-TV.jpg",
  },
  {
    name: "Non Non Biyori Repeat",
    image:
      "https://images-na.ssl-images-amazon.com/images/I/81-RVZ8GdkL._SL1280_.jpg",
  },
  {
    name: "Slime Taoshite 300-nen, Shiranai Uchi ni Level Max ni Nattemashita",
    image:
      "https://www.animefagos.com/wp-content/uploads/2019/10/slimetaoshite30002.jpg",
  },
  {
    name: "Sentouin, Hakenshimasu!",
    image:
      "https://comicvine1.cbsistatic.com/uploads/scale_medium/6/67663/7308803-04.jpg",
  },
  {
    name: "Majo no Tabitabi",
    image:
      "https://pics.filmaffinity.com/majo_no_tabitabi_tv_series-222822126-large.jpg",
  },
  {
    name: "Non non biyori",
    image:
      "https://pics.filmaffinity.com/non_non_biyori_tv_series-162638798-mmed.jpg",
  },
  {
    name: "Jujutsu Kaisen (TV)",
    image: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
  },
  {
    name: "Ore wo Suki Nano wa Omae Dake ka yo",
    image:
      "https://static.wixstatic.com/media/2b52e5_f60454d8f14b4a02a0fddef7e9cd842e~mv2.jpg/v1/fill/w_628,h_1000,al_c,q_90/2b52e5_f60454d8f14b4a02a0fddef7e9cd842e~mv2.jpg",
  },
  {
    name: "Munou na Nana",
    image: "https://pbs.twimg.com/media/Db-tOHHXcAAZAR5.jpg",
  },
  {
    name: "Mahouka Koukou no Rettousei: Raihousha-hen",
    image:
      "https://www.playerone.vg/wp-content/uploads/2020/10/MV5BYmNmMDIzZjktOTcwMS00N2Q1LWE3NTAtNTUwZGJjOWQ3N2NlXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_-scaled.jpg",
  },
  {
    name: "Mahouka Koukou no Rettousei",
    image:
      "https://img1.ak.crunchyroll.com/i/spire3/f2ccbd8ea20320fda0f49b23bb43d2d21396649462_full.jpg",
  },
  {
    name: "Love Live Sunshine Over the Rainbow",
    image:
      "https://i.pinimg.com/originals/ac/02/98/ac02980ea4846300f953b7eca0c95084.jpg",
  },
  {
    name: "Nisekoi",
    image: "https://i.kym-cdn.com/photos/images/original/001/082/371/c57",
  },
  {
    name: "Fullmetal Alchemist: Brotherhood",
    image:
      "https://img1.ak.crunchyroll.com/i/spire4/fabddf1040abbd18948b9aacc18011b31475523493_main.jpg",
  },
  {
    name: "Carole & Tuesday",
    image:
      "https://www.animefagos.com/wp-content/uploads/2018/11/caroletuesday01.jpg",
  },
  {
    name: "Noragami",
    image: "https://animerelleno.com/storage/animes/poster/noragami.jpg",
  },
  {
    name: "Re:Zero kara Hajimeru Isekai Seikatsu",
    image:
      "https://img1.ak.crunchyroll.com/i/spire2/95445cd55c37ce2ff04ef1adde79f50c1529088362_main.jpg",
  },
];

const CATEGS = [
  "Viendo",
  "Pendientes",
  "Vistos",
  "Favoritos",
  "Mangas Terminados",
  "Mangas en espera",
  "Simultcasts",
  "Live Actions",
  "Películas",
  "HBO",
  "Netflix",
  "BBC",
];

export default class Placeholders {
  static async getRandomSerie(): Promise<Serie> {
    const s = SERIES[Math.floor(SERIES.length * Math.random())];
    return {
      _id: await this.getRandomText(),
      timestamp: new Date(),
      name: s.name,
      nameAlt: s.name,
      image: s.image,
      url: "",
      chapter: Math.floor(Math.random() * 24),
    };
  }

  static async getRandomCategory(): Promise<Category> {
    const c = CATEGS[Math.floor(CATEGS.length * Math.random())];
    return {
      _id: await this.getRandomText(),
      name: c,
      timestamp: new Date(),
    };
  }
  static async getRandomText(length: number = 32): Promise<string> {
    const letters = "abcdefghijklnmopqrstuvwxyz ";
    let toret: string = "";
    for (let i = 0; i < length; i++) {
      toret += letters[Math.floor(Math.random() * letters.length)];
    }
    return toret;
  }
}
