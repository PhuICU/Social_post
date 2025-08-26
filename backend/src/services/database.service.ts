import { Collection, Db, MongoClient } from "mongodb";
import env_config from "~/configs/env.config";
import { COMMENT_SCHEMA } from "~/models/schemas/Comments.schema";
import { POSTS_SCHEMA } from "~/models/schemas/Posts.schema";
import { CHAT_SCHEMA } from "~/models/schemas/Chat.schema";
import { MESSAGE_SCHEMA } from "~/models/schemas/Message.schema";
import { IMAGE_SCHEMA } from "~/models/schemas/Image.schema";
import { VIDEO_SCHEMA } from "~/models/schemas/Video.schema";
import { REFRESH_TOKEN_SCHEMA } from "~/models/schemas/Refresh_Token.schema";
import { USER_SCHEMA } from "~/models/schemas/User.schema";
import { FAVORITE_SCHEMA } from "~/models/schemas/Favorites.schema";
import { LIKE_SCHEMA } from "~/models/schemas/Likes.schema";
import { REPORT_SCHEMA } from "~/models/schemas/Reports.schema";
import { FRIEND_SCHEMA } from "~/models/schemas/Friends.schema";
import { NOTIFICATION_SCHEMA } from "~/models/schemas/Notification.schema";

class DatabaseService {
  private client: MongoClient;
  private db: Db;
  constructor() {
    this.client = new MongoClient(env_config.DB_URI as string);
    this.db = this.client.db(env_config.DB_NAME as string);
    console.log(
      "Database URI:",
      env_config.DB_URI,
      "DB_NAME:",
      env_config.DB_NAME
    );
  }

  async connect() {
    try {
      await this.client.connect();
      await this.db.command({ ping: 1 });
      console.log("Connected to the database");
    } catch (error) {
      console.error("Error connecting to the database", error);
    }
  }

  get users(): Collection<USER_SCHEMA> {
    console.log("Users collection:", env_config.DB_COLLECTIONS);
    return this.db.collection(env_config.DB_COLLECTIONS.USERS as string);
  }

  get posts(): Collection<POSTS_SCHEMA> {
    return this.db.collection(env_config.DB_COLLECTIONS.POSTS as string);
  }
  get comments(): Collection<COMMENT_SCHEMA> {
    return this.db.collection(env_config.DB_COLLECTIONS.COMMENTS as string);
  }
  get chats(): Collection<CHAT_SCHEMA> {
    return this.db.collection(env_config.DB_COLLECTIONS.CHATS as string);
  }
  get messages(): Collection<MESSAGE_SCHEMA> {
    return this.db.collection(env_config.DB_COLLECTIONS.MESSAGES as string);
  }
  get images(): Collection<IMAGE_SCHEMA> {
    return this.db.collection(env_config.DB_COLLECTIONS.IMAGES as string);
  }
  get videos(): Collection<VIDEO_SCHEMA> {
    return this.db.collection(env_config.DB_COLLECTIONS.VIDEOS as string);
  }
  get refresh_tokens(): Collection<REFRESH_TOKEN_SCHEMA> {
    return this.db.collection(
      env_config.DB_COLLECTIONS.REFRESH_TOKENS as string
    );
  }
  get favorites(): Collection<FAVORITE_SCHEMA> {
    return this.db.collection(env_config.DB_COLLECTIONS.FAVORITES as string);
  }
  get likes(): Collection<LIKE_SCHEMA> {
    return this.db.collection(env_config.DB_COLLECTIONS.LIKES as string);
  }
  get reports(): Collection<REPORT_SCHEMA> {
    return this.db.collection(env_config.DB_COLLECTIONS.REPORTS as string);
  }
  get friends(): Collection<FRIEND_SCHEMA> {
    return this.db.collection(env_config.DB_COLLECTIONS.FRIENDS as string);
  }
  get notifications(): Collection<NOTIFICATION_SCHEMA> {
    return this.db.collection(
      env_config.DB_COLLECTIONS.NOTIFICATIONS as string
    );
  }
}

const databaseService = new DatabaseService();
export default databaseService;
