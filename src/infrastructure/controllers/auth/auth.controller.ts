import { Body, Controller, Delete, Get, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { AuthUsecases } from "src/usecases/auth/auth.usecases";
import { LoginByMailReqDto } from "./dtos/login_by_mail_req.dto";
import { RegisterRequestDto } from "./dtos/register_request.dto";
import { CurrentUser, UserContext } from "src/infrastructure/common/decorators/user.decorator";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { JwtAuthGuard } from "src/infrastructure/common/guards/jwtAuth.guard";
import { Public } from "src/infrastructure/common/decorators/public.decorator";
import { AuthResponseDto, UserPayloadResponseDto } from "./dtos/auth_res.dto";
import { ApiResponseType } from "src/infrastructure/common/swagger/response.decorator";
import { GoogleOAuth2Guard } from "src/infrastructure/common/guards/google-oauth2.guard";

@Controller("auth")
@ApiTags("Auth")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiExtraModels(AuthResponseDto, UserPayloadResponseDto)
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.AUTH_USECASES)
    private readonly authUsecases: UseCaseProxy<AuthUsecases>,
  ) {}

  @Post("login")
  @Public()
  @ApiOperation({ summary: "Login user by email and password" })
  @ApiResponseType(AuthResponseDto, false)
  async login(@Body() loginDto: LoginByMailReqDto, @Req() req: any) {
    const result = await this.authUsecases
      .getInstance()
      .loginByEmail(loginDto.email, loginDto.password);
    req.res.setHeader("Set-Cookie", result.refreshTokenCookie);
    return { accessToken: result.accessToken };
  }

  @Post("register")
  @Public()
  @ApiOperation({ summary: "Register user by email and password" })
  async register(@Body() registerDto: RegisterRequestDto) {
    const res = await this.authUsecases.getInstance().register(registerDto);
    return { accessToken: res.accessToken };
  }

  @Delete("logout")
  @ApiOperation({ summary: "Logout user" })
  @ApiResponse({ status: 200, description: "Logout successful" })
  async logout(@UserContext() user: CurrentUser, @Req() req: any) {
    await this.authUsecases.getInstance().logout(user.id);
    req.res.setHeader("Set-Cookie", "");
    return { message: "Logout successful" };
  }

  @Post("refresh-token")
  @Public()
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponseType(AuthResponseDto, false)
  async refreshToken(@Req() req: any) {
    const result = await this.authUsecases.getInstance().refreshToken(req.cookies.Refresh);
    req.res.setHeader("Set-Cookie", result.refreshTokenCookie);
    return { accessToken: result.accessToken };
  }

  @Post("is-authenticated")
  @ApiOperation({ summary: "Check if user is authenticated" })
  @ApiResponseType(UserPayloadResponseDto, false)
  async isAuthenticated(@UserContext() user: CurrentUser) {
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role: user.role,
    };
  }

  @Get("google")
  @Public()
  @UseGuards(GoogleOAuth2Guard)
  @ApiOperation({ summary: "Google OAuth2 login redirect" })
  googleOAuth() {}

  @Get("google/call-back")
  @Public()
  @UseGuards(GoogleOAuth2Guard)
  @ApiOperation({ summary: "Google OAuth2 callback" })
  async googleCallBack(@Req() req: any) {
    const { user } = req;
    req.res.setHeader("Set-Cookie", user.refreshTokenCookie);
    return req.res.redirect(
      `${process.env.FRONTEND_URL}/login/success?accessToken=${user.accessToken}`,
    );
  }
}
