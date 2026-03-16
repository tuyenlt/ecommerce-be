import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule } from "nestjs-i18n";

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: "vi",
        loader: I18nJsonLoader,
        loaderOptions: {
          path: join(__dirname, "./"),
          watch: true,
        },
      }),
      resolvers: [AcceptLanguageResolver],
      inject: [ConfigService],
    }),
  ],
  exports: [],
})
export class CustomI18nModule {}
