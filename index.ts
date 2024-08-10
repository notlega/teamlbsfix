interface Rank {
  rank: number;
  name: string;
  score: number;
  dateTime: string;
  newScore: boolean;
}

function getRankFromElement(element: Element): Rank {
  let rank = element.querySelector("div.rank_block_rank")?.textContent || -1;
  const name =
    element.querySelector("div.rank_block_name")?.textContent || "unknown";
  let score =
    element.querySelector("div.rank_block_num.font_x-large")?.textContent || -1;
  const dateTime =
    element.querySelector("div.rank_block_date")?.textContent ||
    element.querySelector("div.rank_block_date_new")?.textContent ||
    "unknown";
  const newScore = element.querySelector("div.rank_block_new_img")
    ? true
    : false;

  if (rank || typeof rank !== "number") {
    rank = parseInt(rank as string);
  }

  if (score || typeof score !== "number") {
    score = parseInt((score as string).replace(/,/g, ""));
  }

  return { rank, name, score, dateTime, newScore };
}

const divBoxes = document.querySelectorAll("div.box01.w420");
const rankBox = divBoxes[divBoxes.length - 1];
const ranks = rankBox.querySelectorAll("div.rank_block");

let lowestRank = 0;
let ranksData: Rank[] = [];

ranks.forEach((rank) => ranksData.push(getRankFromElement(rank)));

ranksData
  .sort((a, b) => b.score - a.score)
  .forEach((rank, index) => {
    const rankDiv = rankBox.querySelectorAll("div.rank_block")[index];

    if (rank.score !== 0) {
      lowestRank = index + 1;
    }

    rankDiv.classList.value = "rank_block rank_bg_normal";

    rankDiv.querySelector("div.rank_block_new_img")?.remove();
    rankDiv.querySelector("div.rank_block_date_new")?.remove();
    rankDiv.querySelector("div.rank_block_date")?.remove();

    // @ts-expect-error
    rankDiv.querySelector("div.rank_block_rank").textContent = index + 1;
    // @ts-expect-error
    rankDiv.querySelector("div.rank_block_name").textContent = rank.name;
    // @ts-expect-error
    rankDiv.querySelector("div.rank_block_num.font_x-large").textContent =
      rank.score.toLocaleString();

    const emptyDiv = rankDiv.querySelector("div:not([class])");
    const imgDiv = document.createElement("div");
    const dateDiv = document.createElement("div");

    if (rank.newScore) {
      imgDiv.classList.add("rank_block_new_img");
      dateDiv.classList.add("rank_block_date_new");

      emptyDiv?.insertBefore(imgDiv, emptyDiv.children[0]);
    }

    if (!rank.newScore) {
      dateDiv.classList.add("rank_block_date");
    }

    dateDiv.textContent = rank.dateTime;

    emptyDiv?.appendChild(dateDiv);

    if (rank.score === 0) {
      // @ts-expect-error
      rankDiv.querySelector("div.rank_block_rank").textContent = (
        lowestRank + 1
      ).toString();
    }

    if (index === 2 || lowestRank + 1 === 3) {
      rankDiv.classList.value = "rank_block rank_bg_3rd";
    }

    if (index === 1 || lowestRank + 1 === 2) {
      rankDiv.classList.value = "rank_block rank_bg_2nd";
    }

    if (index === 0 || lowestRank === 1 || lowestRank + 1 === 1) {
      rankDiv.classList.value = "rank_block rank_bg_1st";
    }
  });
