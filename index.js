import { pages } from "./pages.js";

// CURRENT PAGE
const currentUrl = window.location.href;
const currentPageId = currentUrl.substring(
  currentUrl.lastIndexOf("/") + 1,
  currentUrl.lastIndexOf("_")
);
const currentPage = pages.find((page) => page.id === currentPageId);

// HEAD
document.title = "Tutoriel BlenderBIM - Villa Le Sextant";

const linkFav = document.createElement("link");
linkFav.rel = "icon";
linkFav.type = "image/x-icon";
linkFav.href = "./epfl/favicon.ico";

const linkCss = document.createElement("link");
linkCss.rel = "stylesheet";
linkCss.type = "text/css";
linkCss.href = "./styles.css";

document.head.append(linkFav, linkCss);

// HEADER

const header = document.createElement("header");

const headerLogosContainer = document.createElement("div");
headerLogosContainer.id = "header-logos-container";

const headerLogoEpfl = document.createElement("a");
headerLogoEpfl.href = "https://www.epfl.ch/fr/";
headerLogoEpfl.target = "blank";
const headerLogoEpflImg = document.createElement("img");
headerLogoEpflImg.id = "header-logo-epfl";
headerLogoEpflImg.src =
  "https://www.epfl.ch/wp/5.5/wp-content/themes/wp-theme-2018/assets/svg/epfl-logo.svg?refresh=now";
headerLogoEpflImg.alt = "Logo EPFL, École polytechnique fédérale de Lausanne";

const headerLogoEnac = document.createElement("a");
headerLogoEnac.href = "https://www.epfl.ch/schools/enac/fr/";
headerLogoEnac.target = "blank";
const headerLogoEnacImg = document.createElement("img");
headerLogoEnacImg.classList.add("header-logo-unite");
headerLogoEnacImg.src = "./epfl/EPFL_Unités_ENAC.png";
headerLogoEnacImg.alt =
  "Logo ENAC, Faculté de l’environnement naturel, architectural et construit";

const headerLogoCnpa = document.createElement("a");
headerLogoCnpa.href = "https://www.epfl.ch/labs/cnpa/fr/";
headerLogoCnpa.target = "blank";
const headerLogoCnpaImg = document.createElement("img");
headerLogoCnpaImg.classList.add("header-logo-unite");
headerLogoCnpaImg.src = "./epfl/EPFL_Unités_CNPA.png";
headerLogoCnpaImg.alt =
  "Logo CNPA, Laboratoire des cultures numériques du projet architectural";

const heading1 = document.createElement("h1");
heading1.textContent = "Tutoriel BlenderBIM - Villa Le Sextant";

headerLogoEpfl.appendChild(headerLogoEpflImg);
headerLogoEnac.appendChild(headerLogoEnacImg);
headerLogoCnpa.appendChild(headerLogoCnpaImg);
headerLogosContainer.append(headerLogoEpfl, headerLogoEnac, headerLogoCnpa);
header.append(headerLogosContainer, heading1);

// NAV
const nav = document.createElement("nav");
nav.classList.add("nav-open");

const navOpenButton = document.createElement("button");
navOpenButton.classList.add("nav-button");
navOpenButton.classList.add("nav-open-button");
navOpenButton.textContent = "\u25B8";
navOpenButton.style.display = "none";
nav.appendChild(navOpenButton);

const navCloseButton = document.createElement("button");
navCloseButton.classList.add("nav-button");
navCloseButton.textContent = "\u25BE";
nav.appendChild(navCloseButton);

const navListTitle = document.createElement("p");
navListTitle.classList.add("nav-list-title");
navListTitle.textContent = "PAGES :";
nav.appendChild(navListTitle);

const navList = document.createElement("ol");
navList.setAttribute("id", "nav-list");
nav.appendChild(navList);

const navListItem = document.createElement("li");
navListItem.classList.add("nav-list-item");
navList.appendChild(navListItem);

const navListItems = Array.from(navList.children);

const templateNavListItem = navListItems[0];

for (let page of pages) {
  const newNavListItem = templateNavListItem.cloneNode(true);

  if (page.id === currentPageId) {
    const paragraph = document.createElement("p");
    paragraph.textContent = page.title;
    paragraph.classList.add("current-nav-list-item");

    const subListCloseButton = document.createElement("button");
    subListCloseButton.textContent = "\u25BE";
    subListCloseButton.classList.add("sub-list-button");
    paragraph.prepend(subListCloseButton);

    const subListOpenButton = document.createElement("button");
    subListOpenButton.textContent = "\u25B8";
    subListOpenButton.classList.add("sub-list-button", "sub-list-open-button");
    subListOpenButton.style.display = "none";
    paragraph.prepend(subListOpenButton);

    newNavListItem.appendChild(paragraph);
    navList.appendChild(newNavListItem);

    const subList = document.createElement("ul");
    newNavListItem.appendChild(subList);

    const subHeadings = document.querySelectorAll("h3, h4");
    for (let subHeading of subHeadings) {
      subHeading.id = subHeading.innerText;
      const subItem = document.createElement("li");
      const subItemAnchor = document.createElement("a");
      subItemAnchor.href = "#" + subHeading.id;
      subItemAnchor.textContent = subHeading.innerText;
      if (subHeading.tagName === "H3") {
        subItem.classList.add("sub-item-h3");
      } else {
        subItem.classList.add("sub-item-h4");
      }
      subItem.appendChild(subItemAnchor);
      subList.append(subItem);
    }

    subListCloseButton.onclick = () => {
      subList.style.display = "none";
      subListCloseButton.style.display = "none";
      subListOpenButton.style.display = "inline";
    };
    subListOpenButton.onclick = () => {
      subList.style.display = "block";
      subListOpenButton.style.display = "none";
      subListCloseButton.style.display = "inline";
    };
  } else {
    const anchor = document.createElement("a");
    anchor.classList.add("nav-list-item-anchor");
    anchor.setAttribute("href", page.id + "_" + page.link + ".html");
    anchor.textContent = page.title;

    newNavListItem.appendChild(anchor);
    navList.appendChild(newNavListItem);
  }
}
templateNavListItem.remove();

//NAV VISIBILITY
const section = document.getElementById("section");
section.classList.add("section-nav-open");

navCloseButton.onclick = () => {
  navOpenButton.style.display = "block";
  navCloseButton.style.display = "none";
  navListTitle.style.display = "none";
  nav.classList.add("nav-close");
  navList.style.display = "none";
  section.classList.remove("section-nav-open");
  section.classList.add("section-nav-close");
};
navOpenButton.onclick = () => {
  navOpenButton.style.display = "none";
  navCloseButton.style.display = "block";
  navListTitle.style.display = "block";
  nav.classList.remove("nav-close");
  navList.style.display = "block";
  section.classList.remove("section-nav-close");
  section.classList.add("section-nav-open");
};

// PAGES COMMONS
document.body.prepend(header, nav);

// PAGE TITLE H2
const heading2 = document.createElement("h2");
heading2.textContent = currentPage.title;
section.prepend(heading2);

// DISPLAY CHAPTERS UNDER H3 HEADINGS
const h3ChapterContainers = document.getElementsByClassName(
  "h3-chapter-container"
);
for (let h3ChapterContainer of h3ChapterContainers) {
  const h3 = h3ChapterContainer.querySelectorAll("h3")[0];

  const h3Text = h3.textContent;
  h3.textContent = "";

  const h3Button = document.createElement("button");
  h3Button.textContent = h3Text;
  h3Button.classList.add("h3-chapter-container-button");
  h3.appendChild(h3Button);

  const h3ChapterContent =
    h3ChapterContainer.getElementsByClassName("h3-chapter-content")[0];
  let h3ChapterContentIsHidden = true;

  h3Button.onclick = () => {
    h3ChapterContentIsHidden = !h3ChapterContentIsHidden;
    if (h3ChapterContentIsHidden) {
      h3ChapterContent.style.display = "none";
    } else {
      h3ChapterContent.style.display = "block";
    }
  };
}
