import wikipedia
import json
import requests


password='VMEopT2nEBGT'
username='80124b70-f44f-4279-9656-7b6a11563891'
cluster='sc6a9d6c6f_27e6_4350_8e41_dd35d6650959'
collection='Diseases'

url = 'https://gateway.watsonplatform.net/retrieve-and-rank/api/v1' \
      '/solr_clusters/{}/solr/{}/update'.format(cluster, collection)

diseaseLinks = wikipedia.page('ICD-10 Chapter I: Certain infectious and parasitic diseases').links

for i in range(2, 10):
    page = wikipedia.page(diseaseLinks[i])
    if page.title.startswith('ICD'):
        continue

    print(url)
    payload = {'body': page.content}
    headers = {'Content-Type': 'text/json'}
    r = requests.post(url, json=json.dumps(payload), headers=headers, auth=(username, password))
    print(r.text)


