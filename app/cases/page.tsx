"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  FileWarning,
  FileCheck,
  Plus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";

export default function CasesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none"); // Added state for sorting
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch("/api/cases");
        if (!response.ok) {
          if (response.status === 401) {
            Swal.fire({
              title: "Ошибка",
              text: "Пожалуйста, войдите в систему",
              icon: "error",
              confirmButtonColor: "#10b981",
            }).then(() => {
              router.push("/auth/login");
            });
            return;
          }
          throw new Error("Failed to fetch cases");
        }

        const data = await response.json();
        setCases(data);
        setFilteredCases(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cases:", error);
        setLoading(false);
        Swal.fire({
          title: "Ошибка",
          text: "Не удалось загрузить дела",
          icon: "error",
          confirmButtonColor: "#10b981",
        });
      }
    };

    fetchCases();
  }, [router]);

  useEffect(() => {
    let filtered = [...cases];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Apply risk filter
    if (riskFilter !== "all") {
      filtered = filtered.filter((c) => c.risk === riskFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(term) ||
          c.description.toLowerCase().includes(term),
      );
    }

    // Apply sorting
    if (sortBy === "deadline-asc") {
      filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortBy === "deadline-desc") {
      filtered.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
    }

    setFilteredCases(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, riskFilter, sortBy, cases]);

  const handleNewCase = () => {
    Swal.fire({
      title: "Создание нового дела",
      text: "Вы хотите создать новое дело?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Да, создать",
      cancelButtonText: "Отмена",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/upload");
      }
    });
  };

  const handleRowClick = (id: string) => {
    router.push(`/document/${id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            Ожидает рассмотрения
          </Badge>
        );
      case "review":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
            На рассмотрении
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            Одобрено
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            Отклонено
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">
            Неизвестно
          </Badge>
        );
    }
  };

  const getRiskDisplay = (risk: string) => {
    switch (risk) {
      case "high":
        return (
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-red-500 font-medium">Высокий</span>
          </div>
        );
      case "medium":
        return (
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-amber-500 font-medium">Средний</span>
          </div>
        );
      case "low":
        return (
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">Низкий</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500 font-medium">Неизвестно</span>
          </div>
        );
    }
  };

  const formatDeadline = (deadlineDate: string) => {
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = Math.abs(deadline.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (deadline < today) {
      return (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-red-500" />
          <span className="text-red-500">Просрочено</span>
        </div>
      );
    } else if (diffDays === 0) {
      return (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-red-500" />
          <span className="text-red-500">Сегодня</span>
        </div>
      );
    } else if (diffDays === 1) {
      return (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-red-500" />
          <span className="text-red-500">Завтра</span>
        </div>
      );
    } else if (diffDays <= 3) {
      return (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-amber-500" />
          <span className="text-amber-500">{diffDays} дня</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-blue-500" />
          <span className="text-blue-500">{diffDays} дней</span>
        </div>
      );
    }
  };

  const getDocumentsStatus = (caseItem: any) => {
    if (!caseItem.documents || !caseItem.analysis || !caseItem.analysis.missingDocuments) {
      return (
        <div className="flex items-center gap-1">
          <FileCheck className="h-4 w-4 text-green-500" />
          <span>Все документы</span>
        </div>
      );
    }

    const totalDocs = caseItem.documents.length + caseItem.analysis.missingDocuments.length;
    const uploadedDocs = caseItem.documents.length;

    if (caseItem.analysis.missingDocuments.length === 0) {
      return (
        <div className="flex items-center gap-1">
          <FileCheck className="h-4 w-4 text-green-500" />
          <span>
            {uploadedDocs}/{totalDocs}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          <FileWarning className="h-4 w-4 text-amber-500" />
          <span>
            {uploadedDocs}/{totalDocs}
          </span>
        </div>
      );
    }
  };

  const totalPages = Math.ceil(filteredCases.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCases = filteredCases.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPaginationButtons = () => {
    const buttons: JSX.Element[] = [];
    const maxButtons = 5;
    let startPage: number, endPage: number;

    if (totalPages <= maxButtons) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const sideButtons = Math.floor(maxButtons / 2);
      startPage = Math.max(1, currentPage - sideButtons);
      endPage = Math.min(totalPages, currentPage + sideButtons);

      if (currentPage <= sideButtons + 1) {
        endPage = maxButtons;
      }
      if (currentPage > totalPages - sideButtons) {
        startPage = totalPages - maxButtons + 1;
      }
    }

    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0 transition-all duration-200 hover:bg-muted"
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>,
      );
      if (startPage > 2) {
        buttons.push(
          <Button
            key="start-ellipsis"
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 transition-all duration-200 hover:bg-muted"
            disabled
          >
            ...
          </Button>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant="outline"
          size="sm"
          className={`w-8 h-8 p-0 transition-all duration-200 ${
            i === currentPage ? "bg-emerald-50 text-emerald-700" : "hover:bg-muted"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <Button
            key="end-ellipsis"
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 transition-all duration-200 hover:bg-muted"
            disabled
          >
            ...
          </Button>,
        );
      }
      buttons.push(
        <Button
          key={totalPages}
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0 transition-all duration-200 hover:bg-muted"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>,
      );
    }

    return buttons;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentPath="/cases" />
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Дела</h1>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg"
            onClick={handleNewCase}
          >
            <Plus className="mr-2 h-4 w-4" />
            Новое дело
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск по делам..."
              className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="pending">Ожидает рассмотрения</SelectItem>
                <SelectItem value="review">На рассмотрении</SelectItem>
                <SelectItem value="approved">Одобрено</SelectItem>
                <SelectItem value="rejected">Отклонено</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full sm:w-[180px] transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
                <SelectValue placeholder="Риск" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все уровни риска</SelectItem>
                <SelectItem value="high">Высокий риск</SelectItem>
                <SelectItem value="medium">Средний риск</SelectItem>
                <SelectItem value="low">Низкий риск</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px] transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Без сортировки</SelectItem>
                <SelectItem value="deadline-asc">Дедлайн: По возрастанию</SelectItem>
                <SelectItem value="deadline-desc">Дедлайн: По убыванию</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Название</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Риск</TableHead>
                  <TableHead>Дедлайн</TableHead>
                  <TableHead>Документы</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(7)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="h-6 w-full bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="h-9 w-16 bg-muted animate-pulse rounded ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : currentCases.length > 0 ? (
                  currentCases.map((caseItem: any) => (
                    <TableRow
                      key={caseItem._id}
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => handleRowClick(caseItem._id)}
                    >
                      <TableCell className="font-medium">{caseItem.title}</TableCell>
                      <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                      <TableCell>{getRiskDisplay(caseItem.risk)}</TableCell>
                      <TableCell>{formatDeadline(caseItem.deadline)}</TableCell>
                      <TableCell>{getDocumentsStatus(caseItem)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(caseItem._id);
                          }}
                        >
                          Детали
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Нет дел, соответствующих заданным критериям
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <div className="text-sm text-muted-foreground">
            Показано {Math.min(startIndex + 1, filteredCases.length)}–
            {Math.min(endIndex, filteredCases.length)} из {filteredCases.length} дел
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              className="transition-all duration-200 hover:bg-muted"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Предыдущая
            </Button>
            {getPaginationButtons()}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              className="transition-all duration-200 hover:bg-muted"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Следующая
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}