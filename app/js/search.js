document.getElementById('searchForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      const query = document.getElementById('searchInput').value.trim();
      const resultsContainer = document.getElementById('resultsContainer');
      const resultsTitle = document.getElementById('resultsTitle');

      if (!query) {
        alert('الرجاء كتابة شيء للبحث عنه.');
        return;
      }

      resultsTitle.style.display = 'block';
      resultsContainer.innerHTML = '<p style="text-align: center;">جارٍ البحث، يرجى الانتظار...</p>';

      try {
        const response = await fetch('http://127.0.0.1:8000/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: query })
        });

        if (!response.ok) {
          throw new Error('حدث خطأ أثناء الاتصال بالخادم.');
        }

        const data = await response.json();
        displayResults(data);
      } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = '<p style="color: red; text-align: center;">حدث خطأ أثناء البحث. حاول مرة أخرى لاحقًا.</p>';
      }
    });

    function displayResults(data) {
      const resultsContainer = document.getElementById('resultsContainer');
      resultsContainer.innerHTML = '';

      if (data && data.results && data.results.length > 0) {
        data.results.forEach(item => {
          const resultHTML = `
            <div class="results__item">
              <div class="results__header">
                <div>${item.main_topic || 'غير محدد'}</div>
                <div>${item.surah || 'سورة غير معروفة'}</div>
              </div>
              <div class="results__body">
                <div class="results__body-title">سورة ${item.surah || 'غير محددة'}</div>
                <div class="results__ayah">{ ${item.ayah || ''} }</div>
              </div>
              <div class="results__footer">
                <div class="results__footer-title">التفسير</div>
                <div class="results__tafsir">${item.tafsir || 'لا يوجد تفسير متاح'}</div>
              </div>
            </div>`;
          resultsContainer.innerHTML += resultHTML;
        });
      } else {
        resultsContainer.innerHTML = "<p style='text-align: center;'>لم يتم العثور على نتائج.</p>";
      }
    }

    document.getElementById('downArrow').addEventListener('click', function () {
      window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });