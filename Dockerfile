FROM ruby:3.3-slim AS build
WORKDIR /site

RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    build-essential git \
    && rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .
RUN bundle exec jekyll build

FROM nginx:alpine
COPY --from=build /site/_site /usr/share/nginx/html

EXPOSE 80
