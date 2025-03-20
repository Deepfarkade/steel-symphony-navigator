
import React, { useState } from 'react';
import { Filter, Download, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const ModuleActions: React.FC = () => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  return (
    <div className="flex justify-between mb-6">
      <div className="flex space-x-2">
        <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="bg-white">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-lg">
              <DrawerHeader>
                <DrawerTitle>Configure Filters</DrawerTitle>
                <DrawerDescription>
                  Adjust the filters for your data.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex space-x-2">
                    <input type="date" className="flex-1 border rounded p-2" />
                    <span className="flex items-center">to</span>
                    <input type="date" className="flex-1 border rounded p-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categories</label>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input type="checkbox" id="category1" className="mr-2" />
                      <label htmlFor="category1">High Priority</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="category2" className="mr-2" />
                      <label htmlFor="category2">Medium Priority</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="category3" className="mr-2" />
                      <label htmlFor="category3">Low Priority</label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select className="w-full border rounded p-2">
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <DrawerFooter>
                <Button>Apply Filters</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white">
              <Download className="h-4 w-4 mr-2" />
              Export
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              Export as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ModuleActions;
