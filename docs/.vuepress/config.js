module.exports = {
  lang: "zh-CN",
  title: "Kongasa",
  description: "Kongasa's blog.",

  themeConfig: {
    logo: "/images/logo.png",
    home: "/",
    navbar: [
      {
        text: "learning",
        link: "/learning/",
      },
    ],
    repo: "kongasa/kongasa.github.io",
    repoLabel: "GitHub",
    editLink: false,
    contributors: false,
  },
  head: [["meta", { "http-equiv": "refresh", content: "600" }]],
};
