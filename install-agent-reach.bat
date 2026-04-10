@echo off
chcp 65001 >nul
echo ==========================================
echo Agent Reach 安装脚本 for Mini-OpenClaw
echo ==========================================
echo.

REM 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Python，请先安装 Python 3.11+
    pause
    exit /b 1
)

REM 创建虚拟环境
echo [1/3] 创建虚拟环境...
if not exist "%USERPROFILE%\.agent-reach-venv" (
    python -m venv "%USERPROFILE%\.agent-reach-venv"
)

REM 安装 Agent Reach
echo [2/3] 安装 Agent Reach...
call "%USERPROFILE%\.agent-reach-venv\Scripts\activate.bat"
pip install --upgrade https://github.com/Panniantong/agent-reach/archive/main.zip

REM 安装核心组件
echo [3/3] 安装核心组件...
agent-reach install --env=auto

echo.
echo ==========================================
echo 安装完成！
echo ==========================================
echo.
echo 当前可用渠道（运行 agent-reach doctor 查看详细状态）：
echo   - 任意网页读取 (Jina Reader)
echo   - RSS/Atom 订阅
echo   - V2EX 社区
echo   - B站视频
echo.
echo 要解锁更多渠道，请运行：
echo   agent-reach install --channels=all
echo.
echo 常用命令：
echo   agent-reach doctor          - 检查所有渠道状态
echo   agent-reach check-update    - 检查更新
echo.
pause
