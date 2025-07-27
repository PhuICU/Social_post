import { REFRESH_TOKEN_SCHEMA } from "~/models/schemas/Refresh_Token.schema";
import { ObjectId } from "mongodb";
import databaseService from "./database.service";

class RefreshTokenService {
  public async createRefreshToken(userId: string, token: string) {
    return await databaseService.refresh_tokens.insertOne(
      new REFRESH_TOKEN_SCHEMA({
        user_id: new ObjectId(userId),
        token,
      })
    );
  }
  public async findToken(token: string) {
    return await databaseService.refresh_tokens.findOne({ token });
  }
  public async deleteToken(token: string) {
    return await databaseService.refresh_tokens.deleteOne({ token });
  }
}

const refreshTokenService = new RefreshTokenService();
export default refreshTokenService;
