#!/bin/bash
cd /home/ec2-user/AWS_Thought
docker-compose build --no-cache
docker-compose up -d