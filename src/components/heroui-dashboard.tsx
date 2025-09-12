"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure 
} from "@heroui/modal";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/dropdown";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@heroui/navbar";
import { useState } from "react";
import { MoreVertical, Plus, Search, Bell, User } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  status: "online" | "offline" | "away";
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Product Manager",
    email: "sarah@billr.com",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    status: "online"
  },
  {
    id: "2", 
    name: "Mike Chen",
    role: "Developer",
    email: "mike@billr.com",
    avatar: "https://i.pravatar.cc/150?u=mike",
    status: "away"
  },
  {
    id: "3",
    name: "Lisa Rodriguez",
    role: "Designer",
    email: "lisa@billr.com", 
    avatar: "https://i.pravatar.cc/150?u=lisa",
    status: "offline"
  }
];

export default function HeroUIDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "success";
      case "away": return "warning"; 
      case "offline": return "default";
      default: return "default";
    }
  };

  const handleMemberAction = (member: TeamMember, action: string) => {
    setSelectedMember(member);
    if (action === "view") {
      onOpen();
    }
    console.log(`${action} member:`, member.name);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HeroUI Navbar */}
      <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-card">
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <h1 className="font-neue-montreal-bold text-xl text-brand">billr</h1>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Button variant="light">Dashboard</Button>
          </NavbarItem>
          <NavbarItem isActive>
            <Button color="primary" variant="flat">Team</Button>
          </NavbarItem>
          <NavbarItem>
            <Button variant="light">Invoices</Button>
          </NavbarItem>
          <NavbarItem>
            <Button variant="light">Analytics</Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Badge content="5" color="danger">
              <Button isIconOnly variant="light">
                <Bell className="w-5 h-5" />
              </Button>
            </Badge>
          </NavbarItem>
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  src="https://i.pravatar.cc/150?u=admin"
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">admin@billr.com</p>
                </DropdownItem>
                <DropdownItem key="settings">Settings</DropdownItem>
                <DropdownItem key="help">Help & Feedback</DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          <NavbarMenuItem>
            <Button variant="light" className="w-full justify-start">Dashboard</Button>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Button color="primary" variant="flat" className="w-full justify-start">Team</Button>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Button variant="light" className="w-full justify-start">Invoices</Button>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Button variant="light" className="w-full justify-start">Analytics</Button>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-neue-montreal-bold">Team Management</h2>
            <p className="text-muted-foreground">Manage your team members and their roles</p>
          </div>
          <div className="flex gap-2">
            <Input
              className="w-64"
              placeholder="Search team members..."
              startContent={<Search className="w-4 h-4 text-default-400" />}
            />
            <Button color="primary" startContent={<Plus className="w-4 h-4" />}>
              Add Member
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardBody className="text-center p-6">
              <h3 className="text-2xl font-bold text-brand">12</h3>
              <p className="text-muted-foreground">Total Members</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center p-6">
              <h3 className="text-2xl font-bold text-success">8</h3>
              <p className="text-muted-foreground">Active Members</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center p-6">
              <h3 className="text-2xl font-bold text-warning">3</h3>
              <p className="text-muted-foreground">Pending Invites</p>
            </CardBody>
          </Card>
        </div>

        {/* Team Members List */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-neue-montreal-bold">Team Members</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {mockTeamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge 
                      content="" 
                      color={getStatusColor(member.status)} 
                      shape="circle"
                      className="p-0"
                    >
                      <Avatar src={member.avatar} size="md" />
                    </Badge>
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      size="sm" 
                      color={getStatusColor(member.status)}
                      variant="flat"
                    >
                      {member.status}
                    </Badge>
                    
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Member actions">
                        <DropdownItem 
                          key="view"
                          onPress={() => handleMemberAction(member, "view")}
                        >
                          View Profile
                        </DropdownItem>
                        <DropdownItem 
                          key="edit"
                          onPress={() => handleMemberAction(member, "edit")}
                        >
                          Edit Role
                        </DropdownItem>
                        <DropdownItem 
                          key="message"
                          onPress={() => handleMemberAction(member, "message")}
                        >
                          Send Message
                        </DropdownItem>
                        <DropdownItem 
                          key="remove" 
                          color="danger"
                          onPress={() => handleMemberAction(member, "remove")}
                        >
                          Remove Member
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* HeroUI Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedMember?.name} Profile
                </ModalHeader>
                <ModalBody>
                  {selectedMember && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar src={selectedMember.avatar} size="lg" />
                        <div>
                          <h3 className="text-lg font-semibold">{selectedMember.name}</h3>
                          <p className="text-muted-foreground">{selectedMember.role}</p>
                          <Badge color={getStatusColor(selectedMember.status)} size="sm">
                            {selectedMember.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Input
                          label="Email"
                          value={selectedMember.email}
                          readOnly
                        />
                        <Input
                          label="Role"
                          value={selectedMember.role}
                          readOnly
                        />
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Edit Profile
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
