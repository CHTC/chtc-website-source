# -*- mode: ruby -*-
# vi: set ft=ruby :

# Comment this out if not using a host-only network
class VagrantPlugins::ProviderVirtualBox::Action::Network
  def dhcp_server_matches_config?(dhcp_server, config)
    true
  end
end

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  config.vm.define "chtcsite"

  config.vm.hostname = "chtcsite.vm"
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.
  config.vm.box = "ubuntu/bionic64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  config.vm.synced_folder ".", "/chtc-website-source", type: "rsync",
    rsync__args: ["--verbose", "--archive", "--delete", "-z"]


  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y make gcc g++ rename
    echo 'export NO_PUSH=1' > /etc/profile.d/NO_PUSH.sh
    snap install --classic ruby
    gem install bundle
    cd /chtc-website-source
    runuser -u vagrant -- bundle install
    runuser -u vagrant -- git config --global user.name "Vagrant"
    runuser -u vagrant -- git config --global user.email "vagrant@chtcsite.vm"
    echo ===============================================================================
    echo "Setup complete!"
    echo "Run 'script/cibuild to build the pages, and script/cideploy to deploy them."
    echo "(cideploy will run all deploy steps except for the actual push.)"
    echo ""
    echo "Set BRANCH and TARGET_REPO to test deploying to a different branch"
    echo "or GitHub repo."
    echo
    echo "If you make changes to files outside of the image, run 'vagrant reload'"
    echo "to restart the VM with these new changes."
  SHELL

end
