FROM ruby:3

# Install dependencies
RUN apt-get update -y && apt-get upgrade -y

# Install Gems
COPY Gemfile /tmp/
RUN bundle install --gemfile=/tmp/Gemfile --jobs 20

WORKDIR /app

ENTRYPOINT ["bundle", "exec"]