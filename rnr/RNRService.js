var RNRService = function(watson, username, password) {

    this.watson = watson;
    this.rnr = watson.retrieve_and_rank({
        username: username,
        password: password,
        version: 'v1'
    });

};

RNRService.prototype.createCluster = function(clusterSize, clusterName, callback) {

    var params = {
        cluster_size: clusterSize,
        cluster_name: clusterName
    };

    this.rnr.createCluster(params, callback);

}

RNRService.prototype.listClusters = function(callback) {

    this.rnr.listClusters({}, callback);

}

RNRService.prototype.pollCluster = function(clusterId, callback) {

    var params = {
        cluster_id: clusterId
    };

    this.rnr.pollCluster(params, callback);

}

RNRService.prototype.deleteCluster = function(clusterId, callback) {

    var params = {
        cluster_id: clusterId
    };

    this.rnr.deleteCluster(params, callback);

}

RNRService.prototype.uploadConfig = function(clusterId, configName, configZipPath, callback) {

    var params = {
        cluster_id: clusterId,
        config_name: configName,
        config_zip_path: configZipPath
    };

    this.rnr.uploadConfig(params, callback);

}

RNRService.prototype.listConfigs = function(clusterId, callback) {

    var params = {
        cluster_id: clusterId
    };

    this.rnr.listConfigs(params, callback);

}

RNRService.prototype.getConfig = function(clusterId, configName, callback) {

    var params = {
        cluster_id: clusterId,
        config_name: configName
    };

    return this.rnr.getConfig(params, callback);

}

RNRService.prototype.deleteConfig = function(clusterId, configName, callback) {

    var params = {
        cluster_id: clusterId,
        config_name: configName
    };

    this.rnr.deleteConfig(params, callback);

}

RNRService.prototype.createCollection = function(clusterId, configName, collectionName, callback) {

    var params = {
        cluster_id: clusterId,
        config_name: configName,
        collection_name: collectionName
    };

    this.rnr.createCollection(params, callback);

}

RNRService.prototype.deleteCollection = function(clusterId, collectionName, callback) {

    var params = {
        cluster_id: clusterId,
        collection_name: collectionName
    };

    this.rnr.deleteCollection(params, callback);

}

RNRService.prototype.addDocument = function(doc, clusterId, collectionName, callback) {

    var params = {
        cluster_id: clusterId,
        collection_name: collectionName
    };

    var solrClient = this.rnr.createSolrClient(params);

    solrClient.add(doc, function(err, response) {
        if (err) {
            console.log('Error indexing document: ', err);
        } else {
            console.log('Indexed a document.');
            solrClient.commit(function(err) {
                if (err) {
                    console.log('Error committing change: ' + err);
                } else {
                    console.log('Successfully committed changes.');
                    callback(response);
                }
            });

        }
    });

}

RNRService.prototype.searchSolrCluster = function(question, clusterId, collectionName, callback) {
    
    var params = {
        cluster_id: clusterId,
        collection_name: collectionName,
    };
    
    var solrClient = this.rnr.createSolrClient(params);    
    
    var query = solrClient.createQuery();
    query.q(question);

    solrClient.search(query, function(err, searchResponse) {
        if(err) {
            console.log('Error searching for documents: ' + err);
        }
        else {
            console.log('Found ' + searchResponse.response.numFound + ' documents.');
            console.log('First document: ' + JSON.stringify(searchResponse.response.docs[0], null, 2));
            callback(response);
        }
    });
    
}

RNRService.prototype.createRanker = function(trainingData, callback) {
    
    var params = {
        training_data: fs.createReadStream(trainingData)
    };
    
    this.rnr.createRanker(params, function(err, response) {
        if (err)
            console.log('error: ', err);
        else
            console.log(JSON.stringify(response, null, 2));
            callback(response);
    });
    
}

RNRService.prototype.listRankers = function(callback) {
    
    this.rnr.listRankers({}, callback);
    
}

RNRService.prototype.rankerStatus = function(rankerId, callback) {
    
    var params = {
      ranker_id: rankerId  
    };
    
    this.rnr.rankerStatus(params, callback);
    
}

RNRService.prototype.deleteRanker = function(rankerId, callback) {
    
    var params = {
      ranker_id: rankerId  
    };
    
    this.rnr.deleteRanker(params, callback);
    
}

RNRService.prototype.rank = function(rankerId, answerData, callback) {
    
    var params = {
      ranker_id: rankerId,
      answer_data: fs.createReadStream(answerData)
    };
    
    this.rnr.rank(params, callback);
    
}

RNRService.prototype.searchAndRank = function(clusterId, collectionName, rankerId, question, callback) {
    
    var params = {
      cluster_id: clusterId,
      collection_name: collectionName
    };
    
    var qs = require('qs');
    
    var solrClient = this.rnr.createSolrClient(params);
    
    var query = qs.stringify({q: question, ranker_id: rankerId, fl: 'id,title'});
    
    solrClient.get('fcselect', query, function(err, searchResponse) {
        if(err) {
            console.log('Error searching for documents: ' + err);
        }
        else {
            console.log(JSON.stringify(searchResponse.response.docs, null, 2));
            callback(response);
        }
    });
    
}

RNRService.prototype.getClusterStats = function(clusterId, callback) {
    
    var params = {
      cluster_id: clusterId
    };
    
    this.rnr.getClusterStats(params, callback);
    
}

module.exports.RNRService = RNRService;