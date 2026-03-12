import * as React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { 
  FileText, 
  Upload, 
  Search, 
  MoreVertical, 
  Download, 
  Trash2, 
  Eye,
  FileIcon,
  X,
  Calendar,
  Tag,
  Clock
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  category: string;
}

const Files: React.FC = () => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categorySearch, setCategorySearch] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<FileItem | null>(null);

  const files: FileItem[] = [
    { id: '1', name: 'Invoice_2024_001.pdf', type: 'PDF', size: '1.2 MB', date: '2024-03-10', category: 'Business Cost' },
    { id: '2', name: 'Receipt_Lunch.jpg', type: 'JPG', size: '450 KB', date: '2024-03-09', category: 'Food' },
    { id: '3', name: 'Rent_Agreement.pdf', type: 'PDF', size: '2.5 MB', date: '2024-03-01', category: 'Rent' },
    { id: '4', name: 'Utility_Bill_March.pdf', type: 'PDF', size: '850 KB', date: '2024-03-05', category: 'Bills' },
  ];

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    f.category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleDownload = (file: FileItem) => {
    // In a real app, this would fetch from a server or storage
    // For this demo, we'll create a dummy text file with the file's name
    const content = `This is a mock download for ${file.name}\nSize: ${file.size}\nCategory: ${file.category}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name.endsWith('.pdf') ? file.name.replace('.pdf', '.txt') : `${file.name}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 max-w-2xl">
          <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 focus-within:ring-2 focus-within:ring-emerald-500 transition-all duration-200 flex-1">
            <Search className="w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder:text-zinc-600 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 focus-within:ring-2 focus-within:ring-emerald-500 transition-all duration-200 flex-1">
            <Tag className="w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search by category..." 
              className="bg-transparent border-none outline-none text-sm text-zinc-200 placeholder:text-zinc-600 w-full"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
            />
          </div>
        </div>
        <Button glow className="gap-2 h-11 px-6 font-bold uppercase tracking-widest shrink-0" onClick={() => setIsUploading(true)}>
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="group relative overflow-hidden p-0">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-500">
                  <FileIcon className="w-6 h-6" />
                </div>
                <button className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <h4 className="text-sm font-bold text-white truncate mb-1">{file.name}</h4>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-4">{file.size} • {file.type}</p>
              <Badge variant="default">{file.category}</Badge>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 p-4 bg-zinc-950/90 backdrop-blur-sm border-t border-zinc-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 gap-2 text-xs font-bold uppercase tracking-widest"
                onClick={() => setSelectedFile(file)}
              >
                <Eye className="w-3 h-3" />
                View
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 gap-2 text-xs font-bold uppercase tracking-widest"
                onClick={() => handleDownload(file)}
              >
                <Download className="w-3 h-3" />
                Get
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 text-rose-500 hover:bg-rose-500/10">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {isUploading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-0 bg-zinc-950 border-zinc-900 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-tight">Upload Document</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsUploading(false)} className="text-zinc-500 hover:text-zinc-200">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-dashed border-emerald-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Drag and drop files</h3>
              <p className="text-sm text-zinc-500 mb-8 max-w-xs mx-auto">Upload your bills, receipts, or business documents for safe keeping.</p>
              <Button className="h-11 px-8 font-bold uppercase tracking-widest">Select Files</Button>
            </div>
          </Card>
        </div>
      )}

      {selectedFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-0 bg-zinc-950 border-zinc-900 shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <FileIcon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight truncate max-w-[200px]">
                  {selectedFile.name}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)} className="text-zinc-500 hover:text-zinc-200">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Upload Date</span>
                  </div>
                  <p className="text-sm font-bold text-zinc-200">{selectedFile.date}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500 mb-2">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Category</span>
                  </div>
                  <Badge variant="default">{selectedFile.category}</Badge>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-medium">File Type</span>
                  <span className="text-zinc-200 font-bold">{selectedFile.type}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-medium">File Size</span>
                  <span className="text-zinc-200 font-bold">{selectedFile.size}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-medium">Status</span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Stored Locally
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full h-12 gap-2 font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                  onClick={() => handleDownload(selectedFile)}
                >
                  <Download className="w-4 h-4" />
                  Download Document
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 font-bold uppercase tracking-widest border-zinc-800"
                  onClick={() => setSelectedFile(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Files;
