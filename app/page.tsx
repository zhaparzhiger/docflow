import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, FileText, AlertTriangle, Clock, CheckCircle } from "lucide-react"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header currentPath="/" />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Автоматизация обработки документов для Департамента образования
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Система, которая помогает руководителям быстро и эффективно принимать решения, снижая нагрузку и
                  минимизируя риски.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Начать работу</Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline">Узнать больше</Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-700/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white/90 p-6 rounded-lg shadow-lg max-w-xs">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <span className="font-medium">Автоматический анализ</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <span className="font-medium">Оценка рисков</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Экономия времени</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
                  Возможности
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Как это работает</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Наша система автоматизирует весь процесс обработки документов, от загрузки до принятия решения
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16">
                  <div className="absolute transform rotate-45 bg-emerald-600 text-center text-white font-medium py-1 right-[-35px] top-[32px] w-[170px]">
                    Шаг 1
                  </div>
                </div>
                <CardContent className="p-6 pt-12">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <FileText className="h-6 w-6 text-emerald-700" />
                    </div>
                    <h3 className="text-xl font-bold">Загрузка документов</h3>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Секретарь загружает фотографии или сканы документов в систему через удобный интерфейс
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16">
                  <div className="absolute transform rotate-45 bg-emerald-600 text-center text-white font-medium py-1 right-[-35px] top-[32px] w-[170px]">
                    Шаг 2
                  </div>
                </div>
                <CardContent className="p-6 pt-12">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <BarChart3 className="h-6 w-6 text-emerald-700" />
                    </div>
                    <h3 className="text-xl font-bold">Анализ ИИ</h3>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Система автоматически анализирует содержимое, выделяет ключевую информацию и выявляет недостатки
                  </p>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16">
                  <div className="absolute transform rotate-45 bg-emerald-600 text-center text-white font-medium py-1 right-[-35px] top-[32px] w-[170px]">
                    Шаг 3
                  </div>
                </div>
                <CardContent className="p-6 pt-12">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <AlertTriangle className="h-6 w-6 text-emerald-700" />
                    </div>
                    <h3 className="text-xl font-bold">Оценка рисков</h3>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Формирование SWOT-анализа, определение дедлайнов и приоритетов для принятия решения
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              <span className="text-lg font-semibold">DocFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Система автоматизации обработки документов для Департамента образования
            </p>
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-sm font-medium">Ссылки</div>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:underline">
                О системе
              </Link>
              <Link href="#" className="hover:underline">
                Возможности
              </Link>
              <Link href="#" className="hover:underline">
                Документация
              </Link>
              <Link href="#" className="hover:underline">
                Поддержка
              </Link>
            </nav>
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-sm font-medium">Контакты</div>
            <div className="text-sm text-muted-foreground">
              <p>support@docflow.ru</p>
              <p>+7 (495) 123-45-67</p>
            </div>
          </div>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © 2025 DocFlow. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
