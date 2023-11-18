const cron = require("node-cron");
const mongoose = require("mongoose");
const { connectToDatabase, getDatabase } = require("./databaseConn");

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

async function main() {
  await connectToDatabase();

  try {
    bot.on("new_chat_members", async (msg) => {
      const groupChatId = msg.chat.id;
      const newMembers = msg.new_chat_members;

      console.log(`Bot added to group: ${groupChatId}`);
      console.log("New members:", newMembers);

      const result = await collection.insertOne(data);
      console.log("Document inserted:", result.insertedId);
    });
  } catch (error) {
    console.error("Error performing database operation", error);
  } finally {
    console.log("Disconnected from the database");
  }
}

main().catch(console.error);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  console.log("the starter name is: " + msg.from.first_name);

  const introduction =
    "📚 *Welcome to the LeetCode Daily Problems Bot!* 🚀\n\nAre you ready to supercharge your coding skills and tackle daily programming challenges? Look no further! This bot is here to provide you with a daily dose of brain-teasing LeetCode problems.\n\nEvery day, you'll receive a new problem carefully selected from the vast LeetCode collection. These problems cover a wide range of data structures, algorithms, and programming concepts, helping you sharpen your problem-solving abilities and prepare for technical interviews.\n\nHere's what you can expect from our bot:\n✅ Daily Delivery: Receive a fresh problem right in your Telegram chat every day.\n⚡️ Challenge Yourself: Solve the problem within the suggested time frame to enhance your coding speed and efficiency.\n🏆 Leaderboard: Compete with fellow enthusiasts and see who solves the most problems.\n🔔 Event Notifications: Stay informed about upcoming contests and coding events to further boost your skills.\n🎯 Random Recommendations: Get a surprise challenge from the LeetCode collection with a single command.\n\nTo get started, simply register with the bot using the /register command. Once registered, you'll automatically start receiving daily problems. Use the /help command to explore additional bot features and commands.\n\nSo, are you ready to embark on this coding adventure? Let's solve some LeetCode problems together and level up our programming prowess!\n\nIf you have any questions or need assistance, feel free to reach out. Happy coding! 🚀✨";
  bot.sendMessage(chatId, introduction, {
    parse_mode: "Markdown",
  });
  console.log(msg);
  console.log();
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpManual = `📚 *LeetCode Daily Problems Bot Help Manual* 🤖

Welcome to the help manual for the LeetCode Daily Problems Bot! This guide will provide you with an overview of the bot's features and commands.

1️⃣ /register - Register with the bot to start receiving daily coding problems. Once registered, you'll automatically receive a fresh problem every day.

2️⃣ /problem - Fetch the current daily problem directly in your chat. Use this command if you want to access the problem without waiting for the daily delivery.

3️⃣ /submit <solution> - Submit your solution to the current daily problem. Replace <solution> with your code or algorithmic approach. Be sure to double-check your solution before submitting.

4️⃣ /leaderboard - View the leaderboard and see the top performers who have solved the most problems. Compete with fellow enthusiasts and strive to climb up the ranks.

5️⃣ /recommend - Get a random recommendation from the vast LeetCode problem collection. Use this command when you want to tackle a challenge outside of the daily problem.

6️⃣ /events - Stay informed about upcoming coding contests and events. Get notifications about coding competitions, webinars, and other coding-related activities.

7️⃣ /help - Display this help manual. Use this command whenever you need a quick reminder of the available commands and features.

Remember, the bot is designed to help you enhance your coding skills, prepare for technical interviews, and have fun while solving LeetCode problems. Don't hesitate to reach out if you have any questions or need assistance.

Happy coding! 🚀✨`;
  bot.sendMessage(chatId, helpManual, {
    parse_mode: "Markdown",
  });
});

bot.onText(/\/register/, (msg) => {
  console.log(userList);
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  if (userList.some((users) => users.id == userId)) {
    bot.sendMessage(chatId, "*You* are already registered.", {
      parse_mode: "Markdown",
    });
    return;
  }
  const user = {
    id: userId,
    Fname: msg.from.first_name,
    username: msg.from.username,
  };
  console.log(user);
  userList.push(user);
  bot.sendMessage(msg.from.id, "Successfully Registered!");
});

function fetchDailyProblem() {
  try {
    return problemList[problemNumber++];
  } catch (error) {
    console.log("Index out of range");
  }
  return {
    title: "Sorry, No questions for today!",
    description: "None",
    link: "",
    day: -1,
  };
}
let day = 1;
function sendDailyProblem() {
  const problem = fetchDailyProblem();
  console.log(problem);

  userList.forEach((user) => {
    const message =
      "📚 *Daily LeetCode Problem*\n\n" +
      day++ +
      "\n\n" +
      "Title: " +
      problem.title +
      "\n\n" +
      "Link :\n\n" +
      "https://leetcode.com/problems/" +
      problem.titleSlug;
    bot.sendMessage(user.id, message, { parse_mode: "Markdown" });
  });
}

cron.schedule("26 10 * * *", () => {
  sendDailyProblem();
  console.log("sent!");
});
