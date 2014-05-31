$(document).ready(function(){
var LineID;
var ItemHeadList = ["place","Normal-x","Normal-y","Normal-z","Normal-x-conv","Normal-y-conv","Normal-z-conv","Normal-connect-1","Normal-connect-2","Normal-connect-3","Nether-x","Nether-y","Nether-z","Nether-x-conv","Nether-y-conv","Nether-z-conv","Nether-connect-1","Nether-connect-2","Nether-connect-3"];
	function tableCreate(){
		LineID=-1;
		var obj=$('<tbody>');
		obj.attr("id","maintbl-body");
		var objChild=$('<tr>');
		objChild.attr("id","tr-head");
		var TrHeadList=["place","Normal-coord","Normal-conv","Normal-con","Nether-coord","Nether-conv","Nether-con"];
		var TrHeadLabel=["場所","通常世界","通常->ネザー換算","ネザー接続候補","ネザー","ネザー->通常換算","通常接続候補"];
		for(i=0;i<TrHeadList.length;i++){
			var objGrandChild=$('<td>');
			objGrandChild.attr("id",TrHeadList[i]);
			if(i==0){
				objGrandChild.attr("rowspan",2);
			}else{
				objGrandChild.attr("colspan",3);
			}
			objGrandChild.append(TrHeadLabel[i]);
			objChild.append(objGrandChild);
		}
		obj.append(objChild);
		objChild=$('<tr>');
		objChild.attr("id","tr-subhead");
		for(i=1;i<ItemHeadList.length;i++){
			var objGrandChild=$('<td>');
			objGrandChild.attr("class",ItemHeadList[i]);
			var str;
			if((i-1)%9>=6){
				str=(i-1)%3+1;
			}else{
				switch((i-1)%3){
					case 0:
						str="X";
						break;
					case 1:
						str="Y";
						break;
					case 2:
						str="Z";
						break;
				}
			}
			objGrandChild.append(str);
			objChild.append(objGrandChild);
		}
		obj.append(objChild);
		$("#maintbl").html(obj);
	}
	function getCheckedLine(){
		var arr=[];
		var j=0;
		for(var i=0;i<=LineID;i++){
			if($("#item-"+i+" ."+ItemHeadList[0]+" .checkbox").prop('checked')){
				arr[j++]=i;
			}
		}

		
		return arr;
	}
	function addLine(){
		{//行を作成
			LineID++;
			var obj=$('<tr>');
			obj.attr("class","tr-item");
			obj.attr("id","item-"+ LineID);
			for(var i=0;i<ItemHeadList.length;i++){
				var objChild=$("<td>");
				objChild.attr("class",ItemHeadList[i]);
				if(i==0){
					var objCheckbox=$("<input>");
					objCheckbox.attr("type","checkbox");
					objCheckbox.attr("class","input-area checkbox -input");
					objChild.append(objCheckbox);
				}
				if((i<4)||(i>9&&i<13)){
					objChild.attr("class",function(k,val){return val + " input-td";});
					var objInput=$("<input>");
					objInput.attr("class","input-area "+ItemHeadList[i]+"-input"+(i>0?" input-num":" "));
					objInput.attr("type",i==0?"text":"Number");
					objChild.append(objInput);
				}
				obj.append(objChild);
			}
		}
		$("#maintbl-body").append(obj);
	}


	function getPlace(arr){
		for(var i=0;i<=LineID;i++){
			arr[i]=$("#item-"+i+" .place .place-input").val();
		}
	}
	function getVal(tar,List){
		for(var i=0;i<=LineID;i++){
			var x=$("#item-"+i+" ."+tar+"-x .input-area").val();
			var y=$("#item-"+i+" ."+tar+"-y .input-area").val();
			var z=$("#item-"+i+" ."+tar+"-z .input-area").val();
			List[i]=[x,y,z];
		}
	}
	function conv(tar,magnif,List,ConvList){//距離を換算　配列に各要素を格納
		for(var i=0;i<=LineID;i++){
			var x,y,z;
			x=List[i][0];
			y=List[i][1];
			z=List[i][2];
			var xConv=Math.floor(x*magnif);
			$("#item-"+i+" ."+tar+"-x-conv").text(xConv);
			var yConv=Math.floor(y*1);
			$("#item-"+i+" ."+tar+"-y-conv").text(yConv);
			var zConv=Math.floor(z*magnif);
			$("#item-"+i+" ."+tar+"-z-conv").text(zConv);
			ConvList[i]=[xConv,yConv,zConv];
		}
	}
	function calcLength(arrA,arrB){
		var x,y,z,len;
		x=arrA[0]-arrB[0];
		y=arrA[1]-arrB[1];
		z=arrA[2]-arrB[2];
		len=Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
		return Math.floor(len*100)/100;
	}
	function compare(tar,ConvList,ConnectList,ToList,PlaceList){
		var LengthList=[];
		var RankList =[];
		for(var i=0;i<=LineID;i++){
			LengthList[i]=[];
			for(var j=0;j<=LineID;j++){
				LengthList[i][j]=calcLength(ConvList[i],ToList[j]);
			}
		}
		for(i=0;i<=LineID;i++){
			RankList[i]=[];
			for(j=0;j<=LineID;j++){
				RankList[i][j]=1;
				for(var k=0;k<=LineID;k++){
					RankList[i][j]+=(LengthList[i][j]>LengthList[i][k]);
				}
			}
			for(j=3;j>0;j--){
				var l=0;
				for(k=0;k<=LineID;k++){
					if(RankList[i][k]==j){
						$("#item-"+i+" ."+tar+"-connect-"+(j+l)).text(PlaceList[k]+"\n"+LengthList[i][k]);
						l++;
					}
				}
			}
		}
	}
	function calc(PlaceList,NormalList,NetherList){
		var NormalConvList = [];
		var NormalConnectList = [];
		conv("Normal",0.125,NormalList,NormalConvList);
		var NetherConvList = [];
		var NetherConnectList=[];
		conv("Nether",8,NetherList,NetherConvList);
		compare("Normal",NormalConvList,NormalConnectList,NetherList,PlaceList);
		compare("Nether",NetherConvList,NetherConnectList,NormalList,PlaceList);
	}
	function ioOutput(PlaceList,NormalList,NetherList){
		var IoText="";
		var IoArray=[PlaceList,NormalList,NetherList];
		IoText = JSON.stringify(IoArray);
		$("#io-text").val(IoText);
	}
	function setArray(Place,Normal,Nether){
		LineID=-1;
		function setElem(tar,arr,i){
			$("#item-"+i+" ."+tar+"-x .input-area").val(arr[i][0]);
			$("#item-"+i+" ."+tar+"-y .input-area").val(arr[i][1]);
			$("#item-"+i+" ."+tar+"-z .input-area").val(arr[i][2]);
		}
		for(var i=0;i<Place.length;i++){
			addLine();
			$("#item-"+i+" .place .input-area").val(Place[i]);
			setElem("Normal",Normal,i);
			setElem("Nether",Nether,i);
		}
		LineID=Place.length-1;
	}
	function delLine(){
		var Place=[];
		getPlace(Place);
		var Normal=[];
		getVal("Normal",Normal);
		var Nether=[];
		getVal("Nether",Nether);
		var arr=getCheckedLine();
		for(var i=arr.length-1;i>=0;i--){
			Place.splice(arr[i],1);
			Normal.splice(arr[i],1);
			Nether.splice(arr[i],1);
		}
		tableCreate();
		setArray(Place,Normal,Nether);
		calc(Place,Normal,Nether);
		ioOutput(Place,Normal,Nether);
	}
	function tableChange(){
		var Place=[];
		getPlace(Place);
		var Normal=[];
		getVal("Normal",Normal);
		var Nether=[];
		getVal("Nether",Nether);
		calc(Place,Normal,Nether);
		ioOutput(Place,Normal,Nether);
	}
	function ioChange(){
		tableCreate();
		var IoText=$("#io-text").val();
		var IoArray=JSON.parse(IoText);
		var Place=IoArray[0];
		var Normal=IoArray[1];
		var Nether=IoArray[2];
		setArray(Place,Normal,Nether);
		calc(Place,Normal,Nether);
		ioOutput(Place,Normal,Nether);
	}
	tableCreate();
	addLine();
	addLine();

	$("#maintbl").on("change","input",function(){
		tableChange();
	});
	$("#io-text").on("change",function(){ioChange();});
	$("#btn-addline").click(function(){
	addLine();
	});
	$("#btn-delline").click(function(){
	delLine();
	});
});