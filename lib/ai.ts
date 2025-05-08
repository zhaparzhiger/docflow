export async function analyzeDocuments(content: string) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const prompt = `
      Ты - система искусственного интеллекта для анализа документов в Департаменте образования.
      
      Проанализируй следующие документы:
      
      ${content}
      
      Выполни следующие задачи:
      
      1. Сгенерируй подходящее название дела на основе содержания документов (например, "Мероприятие от [Организатор] в [Место]"). Название должно быть кратким и информативным.
      2. Определи тип мероприятия или запроса.
      3. Выяви ключевую информацию: организатор, место проведения, даты, количество участников, транспорт, проживание.
      4. Оцени риски по шкале от 0 до 100 в трех категориях:
         - Безопасность (риски для здоровья и жизни участников)
         - Документация (полнота и корректность документов)
         - Сопровождение (достаточность персонала и контроля)
      5. Определи, какие документы отсутствуют или требуют доработки.
      6. Составь SWOT-анализ (сильные стороны, слабые стороны, возможности, угрозы).
      7. Предложи рекомендации по улучшению.
      8. Укажи дедлайн для дела в формате ISO (YYYY-MM-DD). Если даты мероприятия известны, используй дату окончания мероприятия как дедлайн. Если даты неизвестны, установи дедлайн на 7 дней от текущей даты (сегодня: ${new Date().toISOString().split("T")[0]}).
      
      Ответ предоставь в формате JSON:
      {
        "title": "Сгенерированное название дела",
        "deadline": "YYYY-MM-DD",
        "organizer": {
          "name": "Название организации",
          "director": "ФИО директора",
          "contacts": {
            "phone": "Телефон",
            "email": "Email"
          }
        },
        "details": {
          "location": "Место проведения",
          "participants": число_участников,
          "transport": "Информация о транспорте",
          "accommodation": "Информация о проживании",
          "dates": {
            "start": "YYYY-MM-DD" | null,
            "end": "YYYY-MM-DD" | null
          }
        },
        "risks": {
          "safety": число_от_0_до_100,
          "documentation": число_от_0_до_100,
          "supervision": число_от_0_до_100
        },
        "missingDocuments": ["Документ 1", "Документ 2", ...],
        "swot": {
          "strengths": ["Сильная сторона 1", "Сильная сторона 2", ...],
          "weaknesses": ["Слабая сторона 1", "Слабая сторона 2", ...],
          "opportunities": ["Возможность 1", "Возможность 2", ...],
          "threats": ["Угроза 1", "Угроза 2", ...]
        },
        "recommendations": ["Рекомендация 1", "Рекомендация 2", ...]
      }
      
      Для полей dates.start, dates.end и deadline возвращай даты в формате ISO (YYYY-MM-DD) или null, если дата неизвестна. Не используй текстовые описания вроде "Неизвестно" или "конец июня".
      `;

      console.log(`Attempting AI analysis, attempt ${attempt + 1}`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("AI API response:", JSON.stringify(data, null, 2));

      // Extract the JSON from the response
      const textResponse = data.candidates[0].content.parts[0].text;

      // Find JSON in the response
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        return JSON.parse(jsonStr);
      }

      throw new Error("No valid JSON found in AI response");
    } catch (error) {
      attempt++;
      console.error(`AI analysis attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }

  return null;
}

export async function generateDescription(title: string, documents: string[]) {
  try {
    const prompt = `
    Ты - система искусственного интеллекта для Департамента образования.
    
    На основе названия дела "${title}" и следующих документов:
    ${documents.join("\n")}
    
    Сгенерируй краткое описание дела (не более 200 символов).
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Error generating description with AI:", error);
    return "Описание не удалось сгенерировать автоматически.";
  }
}

export async function analyzeDocumentsSimple() {
  try {
    return {
      title: "Новое дело",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      organizer: { name: "", contacts: {} },
      details: { location: "", participants: 0, transport: "", accommodation: "", dates: { start: null, end: null } },
      swot: {
        strengths: ["Документы загружены в систему"],
        weaknesses: ["Текст документов не может быть извлечен или проанализирован"],
        opportunities: ["Возможность ручного анализа документов"],
        threats: ["Отсутствие автоматического анализа может привести к пропуску важных деталей"],
      },
      risks: {
        safety: 50,
        documentation: 50,
        supervision: 50,
      },
      missingDocuments: ["Невозможно определить автоматически"],
      recommendations: ["Рекомендуется ручной анализ загруженных документов"],
    };
  } catch (error) {
    console.error("Error in simple AI analysis:", error);
    return null;
  }
}