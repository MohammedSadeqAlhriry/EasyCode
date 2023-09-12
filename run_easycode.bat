@echo off
cd "W:\work\FinalProject\EasyCode\server"
start cmd /k npm run start:dev
cd "W:\work\FinalProject\EasyCode\client"
start cmd /k npm run serve