![Eigosub](./images/logo.png)

Eigosub is a brand new app for Japanese English learner using all youtube videos you like.

# Requirements
- PHP
- pnpm
- youtube_transcript_api
- ./tool/dict

# ./tool/dict
`./tool/dict` should be added to PATH and you should run 'make' in `./tool/dict`.

# How to run
In /api
```
cp .env.example .env
composer install
php artisan queue:work &
php artisan serve
```

In /web
```
pnpm i
pnpm run dev
```