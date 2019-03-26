const puppeteer = require("puppeteer");
const fs = require("fs");
const download = require("download");

// Create download-courses folder if not already
if (!fs.existsSync("downloaded-courses")) {
  fs.mkdirSync(`downloaded-courses`);
}

(async function main() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setViewport({
      width: 1536,
      height: 763
    });

    await page.goto("https://coursehunters.net/course/wes-boss-learn-node");
    await page.waitForSelector(".main");

    const titles = await page.$$(".lessons-list__li");

    var titlesList = [];

    for (const title of titles) {
      const name = await title.$eval("span", span => {
        return span.innerText.replace("Урок ", "");
      });
      titlesList.push(name);
    }
    // console.log(titlesList);

    // if (await page.$$(".standard-block_blue")) {
    await page.$$eval(".jw-video", el => {
      // Grab the url of the video
      var MutationObserver =
        window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;
      var element = document.querySelector(".jw-video");
      setTimeout(function() {
        element.setAttribute("data-text", "whatever");
      }, 5000);
      console.log("Observer is defined or not?");
      console.log(MutationObserver);
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type == "attributes") {
            console.log("attributes changed");
            console.log(element.src);
            window.videoUrl = element.src;
          }
        });
      });
      document.querySelector("#myElement").nextElementSibling.remove();
      observer.observe(element, {
        attributes: true //configure it to listen to attribute changes
      });
      return element.src;
    });
    var videoPlayer = await page.$(".jw-video");
    await videoPlayer.click();
    // await page.waitFor(100000);
    var urlString = await page.$$eval(".original-name", el => window.videoUrl);
    var courseName = await page.$$eval(".original-name", el => el[0].innerHTML);
    var courseFiles = await page.$$eval(".downloads", el => el[0].href);
    console.log("Course files exist on", courseFiles);
    console.log("Course name is ", courseName);
    console.log("Video URL is: ", urlString);

    var [lesson, ext] = urlString
      .substring(urlString.lastIndexOf("/") + 1)
      .split(".");
    var url = urlString.substr(0, urlString.lastIndexOf("/") + 1);
    lesson = lesson.replace(/[0-9]/g, "");
    if (!fs.existsSync(courseName)) {
      console.log("creating directory called: ", courseName);
      fs.mkdirSync(`./downloaded-courses/${courseName}`);
    }

    if (courseFiles.length > 0) {
      download(courseFiles, `./downloaded-courses/${courseName}`).then(() => {
        console.log("done! Downloading course files");
      });
    }

    titlesList.map((title, index) => {
      //   console.log(`${url}${lesson}${index + 1}.${ext} , TITLE: ${title}`);
      download(`${url}${lesson}${index + 1}.${ext}`).then(data => {
        console.log(`Downloading ${url}${lesson}${index + 1}.${ext}`);
        fs.writeFileSync(`${courseName}/${title}.${ext}`, data);
      });
    });
    // } else {
    //   console.log("no video found");
    // }
    // console.log(resultArray);
  } catch (error) {
    console.log("Our error", error);
  }
})();
