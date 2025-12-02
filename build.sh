set -o errexit

pip install -r requirements.txt

python control_escolar_desit_api/control_escolar_desit_api/manage.py collectstatic --no-input
python control_escolar_desit_api/control_escolar_desit_api/manage.py migrate