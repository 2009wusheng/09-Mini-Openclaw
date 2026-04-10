@echo off
chcp 65001 >nul
echo ==========================================
echo Agent Reach 渠道安装向导
echo ==========================================
echo.

call "%USERPROFILE%\.agent-reach-venv\Scripts\activate.bat"

echo 请选择要安装的渠道（输入数字，多个用逗号分隔）：
echo.
echo 社交媒体:
echo   1. Twitter/X    - 推文搜索和时间线
echo   2. 微博         - 热搜、搜索、用户动态
echo   3. 小红书       - 笔记搜索和阅读
echo   4. 抖音         - 视频解析
echo.
echo 内容平台:
echo   5. Reddit       - 帖子搜索和阅读
echo   6. B站完整版    - 热门、排行、搜索
echo   7. 微信公众号   - 文章搜索和阅读
echo   8. 小宇宙播客   - 音频转文字（需Groq Key）
echo.
echo 专业工具:
echo   9. 雪球         - 股票行情、热门帖子
echo   10. LinkedIn   - Profile、职位搜索
echo   11. GitHub     - 仓库搜索（需gh CLI）
echo.
echo   0. 安装全部
echo.

set /p selection="请输入选项: "

if "%selection%"=="0" (
    echo 正在安装所有渠道...
    agent-reach install --env=auto --channels=all
) else (
    set channels=
    echo %selection% | find "1" >nul && set channels=%channels%,twitter
    echo %selection% | find "2" >nul && set channels=%channels%,weibo
    echo %selection% | find "3" >nul && set channels=%channels%,xiaohongshu
    echo %selection% | find "4" >nul && set channels=%channels%,douyin
    echo %selection% | find "5" >nul && set channels=%channels%,reddit
    echo %selection% | find "6" >nul && set channels=%channels%,bilibili
    echo %selection% | find "7" >nul && set channels=%channels%,wechat
    echo %selection% | find "8" >nul && set channels=%channels%,xiaoyuzhou
    echo %selection% | find "9" >nul && set channels=%channels%,xueqiu
    echo %selection% | find "10" >nul && set channels=%channels%,linkedin
    echo %selection% | find "11" >nul && set channels=%channels%,github

    if defined channels (
        set channels=%channels:~1%
        echo 正在安装: %channels%
        agent-reach install --env=auto --channels=%channels%
    ) else (
        echo 未选择有效选项
    )
)

echo.
echo 安装完成！运行 agent-reach doctor 查看状态。
pause
