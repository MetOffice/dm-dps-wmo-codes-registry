Name:		registry-config-codes-wmo
Version:	2.0
Release:	11

Summary:	Registry-core linked data registry

License:	apache
URL:		https://github.com/wmo-registers/codes-wmo-deploy

BuildRoot:	%{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
Source0:	%{name}-%{version}.tar.gz

Requires:       java-1.8.0-openjdk
Requires:       nginx
Requires:       tomcat

Obsoletes:	registry-core-codes-wmo

%description
Configuration of codes-wmo ukgov-ld linked data registry

%prep
%setup -q


%install
rm -rf $RPM_BUILD_ROOT
install -D etc/sudoers.d/reg-sudoers.conf $RPM_BUILD_ROOT/etc/sudoers.d/reg-sudoers.conf
install -D etc/nginx/conf.d/reg-nginx.conf $RPM_BUILD_ROOT/etc/nginx/conf.d/reg-nginx.conf
mkdir -p $RPM_BUILD_ROOT/opt/
cp -pr opt/ldregistry $RPM_BUILD_ROOT/opt/ldregistry
install -D var/lib/tomcat/webapps/ROOT.war $RPM_BUILD_ROOT/var/lib/tomcat/webapps/ROOT.war
mkdir -p $RPM_BUILD_ROOT/var/opt/nginx/cache

%pre
SERVICE='tomcat'
if ps ax | grep -v grep | grep $SERVICE > /dev/null
then
    systemctl stop tomcat
fi
rm -rf /var/lib/tomcat/webapps/ROOT
rm -rf /var/lib/tomcat/webapps/ROOT.war
rm -rf /var/opt/ldregistry/userstore/db.lck
rm -rf /var/opt/ldregistry/userstore/dbex.lck
rm -rf /var/opt/ldregistry/userstore

declare -a arr=("/var/log/ldregistry" "/var/opt/ldregistry")

for sd in "${arr[@]}"
do
    if [[ ! -d $sd ]]; then
	mkdir -p $sd
	chown root:tomcat $sd
	chmod 775 $sd
    fi
done

%post
ln -s /opt/oauth /opt/ldregistry/config/oauth2
service tomcat start

%clean
rm -rf $RPM_BUILD_ROOT



%files
/etc/sudoers.d/reg-sudoers.conf
/etc/nginx/conf.d/reg-nginx.conf
%defattr(775,root,tomcat,775)
/opt/ldregistry
/var/lib/tomcat/webapps/ROOT.war
%defattr(775,nginx,tomcat,775)
/var/opt/nginx/cache


%changelog
* Fri Feb 15 2019 markh <markh@metarelate.net> - 2.0
- deploy 2.0
* Tue Dec 1 2015 markh <markh@metarelate.net> - 1.0-1
- Initial version
