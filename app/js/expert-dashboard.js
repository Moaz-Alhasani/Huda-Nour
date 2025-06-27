// ====================== ENGINE DATASET MANAGEMENT ====================== //
document.getElementById('engineDatasetForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = {
        topic: document.getElementById('topic').value.trim(),
        subtopic: document.getElementById('subtopic').value.trim(),
        surah: document.getElementById('surah').value.trim(),
        ayah: document.getElementById('ayah').value.trim(),
        tafsir: document.getElementById('tafsir').value.trim()
    };

    if (!validateForm(formData)) {
        return;
    }
    submitEngineData(formData);
});

function validateForm(formData) {
    for (const [key, value] of Object.entries(formData)) {
        if (!value) {
            alert(`الرجاء إدخال ${getFieldName(key)}`);
            document.getElementById(key).focus();
            return false;
        }
    }
    return true;
}

function getFieldName(fieldId) {
    const names = {
        topic: 'الموضوع الرئيسي',
        subtopic: 'الموضوع الفرعي',
        surah: 'السورة',
        ayah: 'نص الآية',
        tafsir: 'التفسير'
    };
    return names[fieldId] || 'هذا الحقل';
}

function submitEngineData(formData) {
    const submitBtn = document.querySelector('#engineDatasetForm .submit-btn');
    const originalBtnText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';

    fetch('/api/engine-dataset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(handleResponse)
        .then(data => {
            showSuccess('تم حفظ البيانات بنجاح');
            document.getElementById('engineDatasetForm').reset();
        })
        .catch(error => {
            showError(null, 'حدث خطأ أثناء حفظ البيانات');
            console.error('Save error:', error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
}
