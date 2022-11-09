// const query = "hello";

const variableSizeResults = document.querySelectorAll(".result.imperfect");
variableSizeResults.forEach((result) => {
  const resultScore = parseInt(result.dataset.score, 10);
  result.style.fontSize = `${0.5 + (3.5 * resultScore) / 300}rem`;
});

// assuming you already have rhyme results somewhere, for each of the first 10 results, query the word info api for the rhyming words' info and display them in a dl with that rhyming word
const input = document.getElementById("vestigial");
const text = document.getElementById("query");
const results = document.getElementById("results");
input.onsubmit = async (ev) => {
    ev.preventDefault();
    const rhymes = await search(text.value);
    console.log(rhymes);
    const rhymeInfo = await definitions(rhymes);
    console.log(rhymeInfo);
    const result = await createElem(rhymes, rhymeInfo);
    console.log(result);
    clearResultsElem();
    results.append(...result);

};

async function search (query)
{
    const results = await fetch(`https://rhymebrain.com/talk?function=getRhymes&word=${query}`);
    const rhymes = await results.json();
    const cut10Rhymes = rhymes.slice(0,10);
    return cut10Rhymes;
}

async function definitions (rhymes)
{
    const infos = await Promise.all(
      rhymes.map(async (rhyme) => {
        const info = await fetch(`https://rhymebrain.com/talk?function=getWordInfo&word=${rhyme}`);
        const definition = await info.json();
        return definition;
      })
    );
    return infos;
}

async function createElem(rhymes, infos)
{
  return rhymes.map((rhymeWord, i) => {
    let resultElem = document.createElement("div");
    resultElem.classList.add("result");
    resultElem.dataset.score = rhymeWord.score;
    resultElem.append(rhymeWord.word);

    resultElem.append(createInfoElem(infos[i]));
    resultElem = styleRhymeResult(resultElem);
    return resultElem;
  });
}

function createInfoElem (info) {
  let wordInfoElem = document.createElement("dl");
  for (const [key, value] of Object.entries(info)) {
    let titleElem = document.createElement("dt");
    titleElem.append(key);
    let dataElem = document.createElement("dd");
    dataElem.append(value);
    wordInfoElem.append(titleElem);
    wordInfoElem.append(dataElem);
  }
  return wordInfoElem;
}

function clearResultsElem() {
  Array.from(results.childNodes).forEach((child) => {
    child.remove();
  });
}

function styleRhymeResult(resultElem) {
  const styledResult = resultElem;
  const resultScore = parseInt(resultElem.dataset.score, 10);
  styledResult.style.fontSize = `${0.5 + (3.5 * resultScore) / 300}rem`;
  return styledResult;
}