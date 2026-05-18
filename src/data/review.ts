import type { Question } from '../types/question'
import { ALL_QUESTIONS } from './index'

export interface ObjectiveInfo {
  id: string
  topic: string
  overview: string
  keyPoints: string[]
  keyCommands: string[]
  keyFiles: string[]
}

const OBJECTIVE_INFO: ObjectiveInfo[] = [
  {
    id: '301.1',
    topic: 'Samba Concepts and Architecture',
    overview:
      'Covers the SMB/CIFS protocol history, Samba architecture, and the roles of key Samba daemons.',
    keyPoints: [
      'SMB protocol versions: SMB 1.0 (LAN Manager), SMB 2.0 (Vista/2008), SMB 2.1 (Win7), SMB 3.0 (Win8) — SMB 3.0 introduced end-to-end encryption and Multichannel',
      'Samba 3 supports NT4-style domains; Samba 4 supports full Active Directory Domain Controller functionality including Kerberos and LDAP',
      'Key daemons: smbd (file/print services), nmbd (NetBIOS name resolution), winbindd (AD identity mapping), samba (AD DC mode replaces smbd/nmbd)',
      'NetBIOS name resolution order: lmhosts → WINS server → broadcast → DNS',
      'smb.conf structure: [global] section for server-wide settings plus named share sections',
      'SWAT and web-based tools have been removed; configuration is done via smb.conf or net conf',
    ],
    keyCommands: ['smbd', 'nmbd', 'winbindd', 'samba', 'testparm'],
    keyFiles: ['/etc/samba/smb.conf'],
  },
  {
    id: '301.2',
    topic: 'Samba Configuration',
    overview:
      'Covers smb.conf parameters, registry-based configuration, and tools for validating and managing Samba configuration.',
    keyPoints: [
      'Critical [global] parameters: workgroup, realm, netbios name, server string, security (user/ads/domain)',
      'Registry-based configuration: set "config backend = registry" to store smb.conf under HKLM\\Software\\Samba\\smbconf in the registry',
      '"net conf" commands manage registry configuration: import, setparm, getparm, listshares, addshare, delshare',
      '"testparm" validates smb.conf syntax and prints the effective configuration; use -s to suppress prompts',
      '"interfaces" and "bind interfaces only = yes" restrict which NICs Samba listens on',
      '"log level" controls verbosity (0–10); "log file = /var/log/samba/%m.log" creates per-client logs',
      '"max log size" rotates logs when they reach the specified size in KB',
    ],
    keyCommands: ['testparm', 'net conf', 'smbcontrol', 'net conf import'],
    keyFiles: ['/etc/samba/smb.conf'],
  },
  {
    id: '301.3',
    topic: 'Regular Samba Maintenance',
    overview:
      'Covers TDB database management, backup utilities, and routine Samba maintenance tasks.',
    keyPoints: [
      'TDB (Trivial Database) files store Samba internal state: secrets.tdb, passdb.tdb, account_policy.tdb, registry.tdb, etc.',
      '"tdbdump" prints a TDB file in human-readable form; "tdbtool" provides interactive read/write access',
      '"tdbbackup" creates backup copies of TDB files; use -s to specify a custom suffix (default is .bak)',
      '"smbcontrol" sends control messages to running Samba daemons: reload-config, shutdown, debug, close-share',
      '"net" is a broad admin command: net rpc (domain), net ads (AD), net sam (local accounts), net conf (registry config)',
      'Regularly back up /etc/samba/ and TDB files stored in /var/lib/samba/',
    ],
    keyCommands: ['tdbdump', 'tdbtool', 'tdbbackup', 'smbcontrol', 'net'],
    keyFiles: ['/var/lib/samba/*.tdb', '/etc/samba/smb.conf', '/var/log/samba/'],
  },
  {
    id: '301.4',
    topic: 'Troubleshooting Samba',
    overview:
      'Covers diagnostic tools, log analysis, and common Samba troubleshooting techniques.',
    keyPoints: [
      '"smbclient -L //server" lists shares; "smbclient //server/share" opens an interactive FTP-like session for testing connectivity',
      '"smbstatus" shows current active connections, open files, and locked files',
      '"rpcclient" issues raw RPC calls to Samba or Windows servers; useful for low-level diagnostics (enumdomusers, srvinfo, etc.)',
      '"net ads info" and "net ads testjoin" verify AD domain membership and DC reachability',
      '"testparm -s" dumps the effective config without comments — use to verify the live running configuration',
      'Increase log level in smb.conf or via "smbcontrol smbd debug 5" for live verbose debugging without restart',
      'Clock skew > 5 minutes breaks Kerberos authentication — ensure NTP is configured and synchronized',
    ],
    keyCommands: ['smbclient', 'smbstatus', 'rpcclient', 'testparm', 'net', 'wbinfo'],
    keyFiles: ['/var/log/samba/', '/etc/samba/smb.conf'],
  },
  {
    id: '302.1',
    topic: 'Samba as Active Directory Domain Controller',
    overview:
      'Covers provisioning and operating Samba as a full Active Directory Domain Controller.',
    keyPoints: [
      '"samba-tool domain provision --use-rfc2307 --interactive" provisions a new AD domain',
      'AD DC requires internal Kerberos (Heimdal bundled with Samba) and DNS (Samba internal or BIND9 DLZ)',
      'SYSVOL holds Group Policy Objects; replicate between DCs using rsync or unison (no built-in DFS-R)',
      '"samba-tool domain level show/raise" manages the AD functional level',
      'FSMO roles: PDC Emulator, RID Master, Infrastructure Master (in each domain) + Schema Master, Domain Naming Master (forest-wide)',
      '"samba-tool fsmo show" and "samba-tool fsmo transfer/seize" manage FSMO role placement',
      'NTP/chrony time synchronization is critical — Kerberos requires < 5 minutes clock skew',
    ],
    keyCommands: [
      'samba-tool domain provision',
      'samba-tool fsmo',
      'samba-tool domain level',
      'rsync',
      'unison',
    ],
    keyFiles: ['/etc/samba/smb.conf', '/var/lib/samba/sysvol/', '/etc/krb5.conf'],
  },
  {
    id: '302.2',
    topic: 'Active Directory Name Resolution',
    overview:
      'Covers DNS configuration for Samba AD, including internal DNS and BIND9 DLZ integration.',
    keyPoints: [
      'AD requires DNS SRV records for KDC (_kerberos._tcp), LDAP (_ldap._tcp), and other services',
      'Samba internal DNS: built-in, simple, enabled by default; set "dns forwarder" for external resolution',
      'BIND9 DLZ (Dynamically Loadable Zones): use for complex DNS environments; requires the bind9_dlz.so plugin',
      '"samba-tool dns add/delete/query/update" manages DNS records programmatically',
      '/etc/resolv.conf on domain members should point to the Samba DC IP for AD-aware name resolution',
      '/etc/krb5.conf must specify the correct realm and KDC address',
    ],
    keyCommands: ['samba-tool dns', 'host', 'nslookup', 'dig'],
    keyFiles: ['/etc/resolv.conf', '/etc/krb5.conf', '/etc/named.conf'],
  },
  {
    id: '302.3',
    topic: 'Active Directory User Management',
    overview:
      'Covers creating and managing AD users, groups, and organizational units with Samba tools.',
    keyPoints: [
      '"samba-tool user add/delete/setpassword/enable/disable" for full user lifecycle management',
      '"samba-tool group add/delete/addmembers/removemembers" for group management',
      'RFC 2307 attributes (uidNumber, gidNumber, loginShell, unixHomeDirectory) enable POSIX access for AD users',
      '"samba-tool domain passwordsettings" configures password complexity, length, history, and lockout policy',
      'Group types: Security (for ACLs) vs Distribution (email only); scopes: Domain Local, Global, Universal',
      '"samba-tool ou create/delete" manages Organizational Units for hierarchical user/computer organization',
    ],
    keyCommands: [
      'samba-tool user',
      'samba-tool group',
      'samba-tool ou',
      'samba-tool domain passwordsettings',
    ],
    keyFiles: [],
  },
  {
    id: '302.4',
    topic: 'Samba Domain Membership',
    overview:
      'Covers joining Linux systems to an AD domain and configuring identity services via winbindd.',
    keyPoints: [
      '"net ads join -U Administrator" joins the Linux host to an AD domain, creating a machine account',
      'winbindd provides NSS and PAM integration so AD users/groups resolve on the Linux host',
      'nsswitch.conf: add "winbind" to the passwd and group entries for AD identity resolution',
      'ID mapping backends: rid (deterministic from RID), ad (reads RFC 2307 attrs), autorid (multi-domain), tdb (local arbitrary)',
      '"wbinfo -u/-g/-t" lists AD users/groups and tests the winbind–DC trust channel',
      '"net ads testjoin" verifies the machine account is valid and the domain join is healthy',
      '"kinit user@REALM" obtains a Kerberos TGT; "klist" shows cached tickets; "kdestroy" removes them',
    ],
    keyCommands: ['net ads join', 'net ads testjoin', 'wbinfo', 'kinit', 'klist', 'kdestroy'],
    keyFiles: ['/etc/nsswitch.conf', '/etc/krb5.conf', '/etc/samba/smb.conf'],
  },
  {
    id: '302.5',
    topic: 'Samba Local User Management',
    overview:
      'Covers managing local Samba accounts via pdbedit, smbpasswd, and passdb backends.',
    keyPoints: [
      '"pdbedit -L" lists all Samba users; -a adds, -r modifies, -x deletes accounts in the passdb',
      '"smbpasswd" sets or changes a Samba password; -a adds, -d disables, -e enables, -x deletes a user',
      'passdb backends: tdbsam (default TDB file), ldapsam (LDAP backend), smbpasswd (legacy plaintext — avoid)',
      'Set the backend with: "passdb backend = tdbsam:/var/lib/samba/passdb.tdb"',
      'A Unix system account must exist for every Samba user (Samba does not create system accounts)',
      '"pdbedit -L -v" shows verbose account details including SID, account flags, and last login',
    ],
    keyCommands: ['pdbedit', 'smbpasswd', 'net sam'],
    keyFiles: ['/var/lib/samba/passdb.tdb', '/etc/samba/smb.conf'],
  },
  {
    id: '303.1',
    topic: 'File Share Configuration',
    overview:
      'Covers defining Samba file shares and controlling access with smb.conf share parameters.',
    keyPoints: [
      'Share definition: [sharename] section with path, comment, browseable, read only / writable',
      '"valid users" restricts who may connect to a share; "@group" syntax includes group members',
      '"write list" grants write access to specific users/groups even when the share is read-only',
      'Guest access: "guest ok = yes" (synonym: "public = yes") allows unauthenticated connections',
      '[homes] special section auto-creates a private share for each user\'s home directory',
      '"vfs objects" extend share functionality: vfs_fruit (macOS Time Machine), vfs_shadow_copy2 (snapshots), vfs_recycle (trash)',
      '"force user" and "force group" run all file operations as a specific Unix user/group',
    ],
    keyCommands: ['testparm', 'smbclient'],
    keyFiles: ['/etc/samba/smb.conf'],
  },
  {
    id: '303.2',
    topic: 'File Share Security',
    overview:
      'Covers POSIX and Windows ACLs on Samba shares, permission masks, and security configuration.',
    keyPoints: [
      '"create mask" and "force create mode" control the permission bits of newly created files',
      '"directory mask" and "force directory mode" control permissions on new directories',
      '"vfs objects = acl_xattr" stores Windows ACLs as extended attributes; requires an xattr-capable filesystem',
      '"security = ads" (Active Directory) or "security = domain" (NT4 domain) for domain-integrated authentication',
      '"smbcacls" displays and modifies Windows ACLs on remote share objects',
      '"inherit acls = yes" causes new objects to inherit the parent directory\'s ACL',
      'POSIX ACLs (setfacl / getfacl) can be used in conjunction with Samba for fine-grained UNIX-side control',
    ],
    keyCommands: ['smbcacls', 'smbchown', 'setfacl', 'getfacl'],
    keyFiles: ['/etc/samba/smb.conf'],
  },
  {
    id: '303.3',
    topic: 'DFS Share Configuration',
    overview: 'Covers Microsoft Distributed File System (DFS) namespace configuration with Samba.',
    keyPoints: [
      '"host msdfs = yes" in [global] enables DFS support globally on the Samba server',
      '"msdfs root = yes" in a share section marks that share as a DFS root namespace',
      'DFS links (junctions) are created as symbolic links with target "msdfs:server\\share" or "msdfs:server\\share,server2\\share" for redundancy',
      'DFS allows presenting multiple backend shares under a unified logical namespace to clients',
      'Windows clients follow DFS referrals transparently without knowing the actual backend share location',
    ],
    keyCommands: ['smbclient'],
    keyFiles: ['/etc/samba/smb.conf'],
  },
  {
    id: '303.4',
    topic: 'Print Share Configuration',
    overview:
      'Covers Samba print server setup, printer driver management, and CUPS integration.',
    keyPoints: [
      '[printers] special share section with "printable = yes" (or "print ok = yes") enables automatic printer sharing',
      '[print$] is the hard-coded share name Windows uses to download printer drivers; cannot be renamed',
      '"printing = CUPS" integrates Samba with the local CUPS print backend',
      '"SePrintOperatorPrivilege" must be granted (via "net rpc rights grant") to users who upload drivers',
      'spoolssd service (Samba ≤ 4.15) or rpcd_spoolss (Samba ≥ 4.16) handles the print spooler RPC',
      'Point-and-Print: Windows clients automatically download drivers from [print$] when connecting',
    ],
    keyCommands: ['rpcclient', 'smbclient', 'net rpc rights'],
    keyFiles: ['/etc/samba/smb.conf', '/etc/cups/printers.conf'],
  },
  {
    id: '304.1',
    topic: 'Linux Authentication Clients',
    overview:
      'Covers SSSD, PAM, and NSS configuration for integrating Linux clients with AD, IPA, and LDAP.',
    keyPoints: [
      'SSSD (System Security Services Daemon) provides centralized identity caching and authentication for remote identity sources',
      'sssd.conf: configure [sssd] (services list) and [domain/NAME] sections with id_provider and auth_provider',
      'id_provider options: ldap, ad, ipa, proxy; auth_provider: ldap, krb5, ad, ipa',
      'SSSD on-disk cache is stored as LDB files under /var/lib/sss/db/; "sss_cache -E" invalidates all entries',
      '"pam_sss.so" PAM module enables SSSD-based authentication in the PAM stack',
      'nsswitch.conf: add "sss" to passwd, group, and shadow entries for SSSD identity resolution',
      '"authselect" (RHEL/Fedora) or "authconfig" (older RHEL) automates PAM and NSS configuration for SSSD',
    ],
    keyCommands: ['sss_cache', 'sssctl', 'authselect', 'authconfig'],
    keyFiles: ['/etc/sssd/sssd.conf', '/var/lib/sss/db/', '/etc/nsswitch.conf', '/etc/pam.d/'],
  },
  {
    id: '304.2',
    topic: 'Linux CIFS Clients',
    overview: 'Covers mounting SMB/CIFS shares on Linux using cifs-utils.',
    keyPoints: [
      '"mount -t cifs" and "mount.cifs" are equivalent commands for mounting CIFS shares',
      'Common mount options: username=, password=, domain=, vers= (SMB version), uid=, gid=, file_mode=, dir_mode=',
      'Credentials file: store username/password in a file (chmod 600), reference with "credentials=/path/file" mount option',
      '/etc/fstab entry: //server/share /mnt/point cifs credentials=/etc/samba/cred,_netdev,x-systemd.automount 0 0',
      '"vers=3.0" (or higher) is recommended; "vers=2.0" for older servers; "vers=1.0" requires enabling in kernel (insecure)',
      'cifs-utils package provides mount.cifs, smbinfo, getcifsacl, and setcifsacl utilities',
    ],
    keyCommands: ['mount.cifs', 'mount -t cifs', 'umount'],
    keyFiles: ['/etc/fstab', '/etc/samba/credentials'],
  },
  {
    id: '304.3',
    topic: 'Windows Clients',
    overview:
      'Covers configuring Windows clients to interact with Samba shares and AD environments.',
    keyPoints: [
      '"net use Z: \\\\server\\share /user:domain\\user password" maps a network drive from the command line',
      'Group Policy Objects (GPOs) can persistently map drives, configure security settings, and deploy software',
      'Windows Credential Manager stores SMB credentials so re-entry is not required on reconnect',
      'Windows prefers Kerberos over NTLM when the client is joined to an AD domain',
      'Kerberos requires clock synchronization (< 5 minutes skew) between client, DC, and file server',
      'DFS client is built into Windows; it transparently follows DFS referrals to backend shares',
    ],
    keyCommands: ['net use', 'net view', 'klist', 'gpupdate /force'],
    keyFiles: [],
  },
  {
    id: '305.1',
    topic: 'FreeIPA Installation and Maintenance',
    overview:
      'Covers installing, replicating, and maintaining a FreeIPA identity management server.',
    keyPoints: [
      '"ipa-server-install" provisions a FreeIPA server, integrating 389 Directory Server, MIT Kerberos, Dogtag CA, and BIND DNS',
      'FreeIPA provides integrated LDAP, Kerberos KDC, Certificate Authority, and DNS in a single install',
      '"ipa-replica-install" adds a new replica for high availability and load distribution',
      '"ipa-backup" creates a full backup; "ipa-restore" recovers from backup',
      '"ipactl start/stop/restart/status" controls all IPA services atomically',
      'The FreeIPA web UI is available at https://ipaserver.domain/ for browser-based administration',
    ],
    keyCommands: ['ipa-server-install', 'ipa-replica-install', 'ipa-backup', 'ipa-restore', 'ipactl'],
    keyFiles: ['/etc/ipa/default.conf', '/etc/krb5.conf'],
  },
  {
    id: '305.2',
    topic: 'FreeIPA Entity Management',
    overview:
      'Covers managing users, groups, hosts, services, sudo rules, and HBAC policies in FreeIPA.',
    keyPoints: [
      '"ipa user-add", "ipa group-add", "ipa host-add" create entities; most parameters are settable at creation or later',
      'HBAC (Host-Based Access Control): "ipa hbacrule-add" controls which users can log in to which hosts via which services',
      'sudo rules: "ipa sudorule-add" defines centrally-managed sudo permissions deployed to IPA-enrolled hosts via SSSD',
      '"ipa service-add HTTP/host.domain@REALM" creates a Kerberos service principal; "ipa-getkeytab" retrieves the keytab file',
      '"ipa dnsrecord-add/del" manages DNS records integrated with the IPA directory',
      'Role-Based Access Control (RBAC): "ipa role-add" and "ipa privilege-add" enable delegated administration',
    ],
    keyCommands: ['ipa user-add', 'ipa group-add', 'ipa hbacrule-add', 'ipa sudorule-add', 'ipa-getkeytab'],
    keyFiles: [],
  },
  {
    id: '305.3',
    topic: 'FreeIPA Active Directory Integration',
    overview:
      'Covers establishing and managing cross-forest trusts between FreeIPA and Active Directory.',
    keyPoints: [
      '"ipa trust-add --type=ad AD.DOMAIN --admin Administrator" establishes a cross-forest trust with AD',
      'Both FreeIPA and AD forests must be able to resolve each other\'s DNS zones (use conditional forwarding)',
      'ID ranges for trusted AD users: "ipa idrange-add/mod" maps AD SIDs to local POSIX UIDs/GIDs',
      '"ipa trust-show AD.DOMAIN" and "ipa trust-find" inspect trust status and attributes',
      'External trusts cover one AD domain; forest trusts cover the AD forest root and all child domains',
      'SSSD on IPA-enrolled clients handles AD user lookups through the IPA trust automatically',
    ],
    keyCommands: ['ipa trust-add', 'ipa trust-show', 'ipa idrange-add'],
    keyFiles: ['/etc/sssd/sssd.conf', '/etc/krb5.conf'],
  },
  {
    id: '305.4',
    topic: 'Network File System',
    overview:
      'Covers NFSv4 server and client configuration, including Kerberos security integration.',
    keyPoints: [
      '/etc/exports defines NFS exports: /path client(options); "exportfs -rav" reloads and re-exports',
      'NFSv4 Kerberos security options: sec=krb5 (authentication only), sec=krb5i (+ integrity), sec=krb5p (+ encryption)',
      'Kerberos NFS requires a "nfs/server.domain@REALM" service principal and keytab on the server',
      '"idmapd" (/etc/idmapd.conf) maps numeric UIDs/GIDs to names for NFSv4; the Domain must match on client and server',
      '"nfs-server.service" exports shares; rpcbind is needed for NFSv3 portmapping (optional for NFSv4 on port 2049)',
      'Client mount: "mount -t nfs4 -o sec=krb5 server:/export /mnt"',
    ],
    keyCommands: ['exportfs', 'showmount', 'mount -t nfs4', 'nfsidmap', 'rpcinfo'],
    keyFiles: ['/etc/exports', '/etc/idmapd.conf', '/etc/krb5.conf'],
  },
]

export const PARENT_TOPICS: { id: string; label: string; objectives: string[] }[] = [
  { id: '301', label: '301 – Samba and Basic Setup', objectives: ['301.1', '301.2', '301.3', '301.4'] },
  { id: '302', label: '302 – Samba and Active Directory', objectives: ['302.1', '302.2', '302.3', '302.4', '302.5'] },
  { id: '303', label: '303 – Samba Share Configuration', objectives: ['303.1', '303.2', '303.3', '303.4'] },
  { id: '304', label: '304 – Samba Client Configuration', objectives: ['304.1', '304.2', '304.3'] },
  { id: '305', label: '305 – FreeIPA and Kerberos', objectives: ['305.1', '305.2', '305.3', '305.4'] },
]

export const OBJECTIVE_MAP: Map<string, ObjectiveInfo> = new Map(
  OBJECTIVE_INFO.map((obj) => [obj.id, obj]),
)

function getDomainLabel(url: string): string {
  try {
    const { hostname } = new URL(url)
    const labels: Record<string, string> = {
      'www.samba.org': 'Samba Docs',
      'wiki.samba.org': 'Samba Wiki',
      'learn.microsoft.com': 'Microsoft Learn',
      'manpages.debian.org': 'Debian Man Pages',
      'dyn.manpages.debian.org': 'Debian Man Pages',
      'github.com': 'GitHub',
      'docs.redhat.com': 'Red Hat Docs',
      'access.redhat.com': 'Red Hat Knowledge Base',
      'www.freeipa.org': 'FreeIPA Docs',
      'wiki.freeipa.org': 'FreeIPA Wiki',
      'sssd.io': 'SSSD Docs',
      'wiki.archlinux.org': 'Arch Wiki',
    }
    return labels[hostname] ?? hostname
  } catch {
    return url
  }
}

export interface ReferenceEntry {
  url: string
  label: string
}

export function getObjectiveReferences(objectiveId: string): ReferenceEntry[] {
  const questions = (ALL_QUESTIONS as Question[]).filter((q) => q.objective === objectiveId)
  const seen = new Set<string>()
  const refs: ReferenceEntry[] = []
  for (const q of questions) {
    if (!seen.has(q.reference)) {
      seen.add(q.reference)
      refs.push({ url: q.reference, label: getDomainLabel(q.reference) })
    }
  }
  return refs
}
